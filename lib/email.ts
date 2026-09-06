/**
 * Servicio de envío de correos electrónicos para Viva Raíces
 * Soporta Resend REST API (sin dependencias adicionales) con simulación transparente si no hay API key.
 */

interface SendEmailParams {
  to: string
  subject: string
  html: string
  text?: string
}

export async function sendEmail({ to, subject, html, text }: SendEmailParams): Promise<{
  success: boolean
  id?: string
  simulated?: boolean
  error?: string
}> {
  const apiKey = process.env.RESEND_API_KEY
  const from = process.env.EMAIL_FROM || 'Viva Raíces <reservas@raicesyucatan.com>'

  if (!apiKey) {
    console.log(
      `[Email Service (Modo Simulación)]: Correo a "${to}" | Asunto: "${subject}"`
    )
    return { success: true, simulated: true }
  }

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from,
        to: [to],
        subject,
        html,
        text,
      }),
    })

    const data = await res.json()
    if (!res.ok) {
      console.error('Error al enviar correo con Resend:', data)
      return { success: false, error: data?.message || 'Error en servidor de correo' }
    }

    return { success: true, id: data.id }
  } catch (err: unknown) {
    console.error('Error inesperado al enviar correo:', err)
    return {
      success: false,
      error: err instanceof Error ? err.message : String(err),
    }
  }
}

/**
 * Notificación por correo al registrarse en la lista de espera de fechas futuras
 */
export async function sendWaitlistConfirmationEmail({
  email,
  targetDate,
  experienceOrPackage,
}: {
  email: string
  targetDate?: string | null
  experienceOrPackage?: string
}) {
  const dateFormatted = targetDate || 'la fecha que nos indicaste'
  const expLabel = experienceOrPackage ? ` para <strong>${experienceOrPackage}</strong>` : ''

  const subject = `Aviso de disponibilidad recibido · Raíces Yucatán`
  const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 580px; margin: 0 auto; padding: 24px; color: #1F2937; background-color: #FAFAF8; border-radius: 16px; border: 1px solid #E5E7EB;">
      <div style="text-align: center; margin-bottom: 24px;">
        <h1 style="color: #2D5A43; font-size: 28px; margin: 0; font-weight: 700;">Raíces</h1>
        <p style="color: #6B7280; font-size: 14px; margin-top: 4px;">Turismo Vivencial y Comunitario en Yucatán</p>
      </div>

      <div style="background-color: #FFFFFF; border-radius: 12px; padding: 24px; border: 1px solid #F3F4F6;">
        <h2 style="color: #111827; font-size: 18px; margin-top: 0;">¡Hemos anotado tu fecha con éxito!</h2>
        <p style="font-size: 14px; line-height: 1.6; color: #4B5563;">
          Recibimos tu solicitud de interés${expLabel} para <strong>${dateFormatted}</strong>.
        </p>
        <p style="font-size: 14px; line-height: 1.6; color: #4B5563;">
          Los talleres y experiencias de Raíces son guiados por familias y colectivos artesanos locales en grupos reducidos. Por ello, las agendas se confirman periódicamente con las comunidades.
        </p>

        <div style="background-color: #F0FDF4; border-left: 4px solid #16A34A; padding: 12px 16px; margin: 20px 0; border-radius: 4px;">
          <p style="margin: 0; font-size: 13px; color: #166534; font-weight: 500;">
            Te contactaremos a este correo electrónico en cuanto se abra el calendario oficial para esas fechas para que tengas acceso prioritario y apartes tu lugar.
          </p>
        </div>

        <p style="font-size: 13px; color: #6B7280; margin-bottom: 0;">
          Si necesitas ajustar tus planes o hacernos alguna consulta, simplemente responde a este correo.
        </p>
      </div>

      <div style="text-align: center; margin-top: 24px; font-size: 12px; color: #9CA3AF;">
        <p style="margin: 0;">Raíces Yucatán · Conectando viajeros con la sabiduría artesanal</p>
      </div>
    </div>
  `

  return sendEmail({
    to: email,
    subject,
    html,
    text: `Hemos recibido tu interés para ${dateFormatted}. Te avisaremos por este medio en cuanto los artesanos abran su agenda.`,
  })
}

/**
 * Notificación por correo al confirmar una reservación
 */
export async function sendReservationConfirmationEmail({
  email,
  customerName,
  code,
  startDate,
  total,
}: {
  email: string
  customerName?: string | null
  code: string
  startDate?: string | null
  total: number
}) {
  const name = customerName ? ` ${customerName}` : ''
  const subject = `Tu reservación está lista (Código: ${code}) · Raíces Yucatán`
  const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 580px; margin: 0 auto; padding: 24px; color: #1F2937; background-color: #FAFAF8; border-radius: 16px; border: 1px solid #E5E7EB;">
      <div style="text-align: center; margin-bottom: 24px;">
        <h1 style="color: #2D5A43; font-size: 28px; margin: 0; font-weight: 700;">Raíces</h1>
        <p style="color: #6B7280; font-size: 14px; margin-top: 4px;">Confirmación de Reservación</p>
      </div>

      <div style="background-color: #FFFFFF; border-radius: 12px; padding: 24px; border: 1px solid #F3F4F6;">
        <h2 style="color: #111827; font-size: 18px; margin-top: 0;">¡Hola${name}! Tu lugar está apartado</h2>
        <p style="font-size: 14px; line-height: 1.6; color: #4B5563;">
          Hemos registrado tu reservación en nuestro sistema. Aquí están los detalles principales:
        </p>

        <div style="background-color: #F9FAFB; padding: 16px; border-radius: 8px; margin: 16px 0;">
          <p style="margin: 0 0 8px 0; font-size: 14px;"><strong>Código de reservación:</strong> <span style="font-family: monospace; font-size: 16px; color: #2D5A43;">${code}</span></p>
          ${startDate ? `<p style="margin: 0 0 8px 0; font-size: 14px;"><strong>Fecha:</strong> ${startDate}</p>` : ''}
          <p style="margin: 0; font-size: 14px;"><strong>Total estimado:</strong> $${total.toLocaleString('es-MX')} MXN</p>
        </div>

        <p style="font-size: 14px; line-height: 1.6; color: #4B5563;">
          <strong>Coordinación artesanal:</strong> Nuestro equipo se pondrá en contacto contigo por correo para darte las indicaciones de llegada al taller y resolver cualquier detalle previo a tu visita.
        </p>
      </div>
    </div>
  `

  return sendEmail({
    to: email,
    subject,
    html,
    text: `Tu reservación con código ${code} ha sido registrada.`,
  })
}
