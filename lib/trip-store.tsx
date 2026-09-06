'use client'

import { createContext, useContext, useMemo, useReducer, type ReactNode } from 'react'
import {
  EXPERIENCE_MAP,
  PACKAGES,
  TRANSPORT_PRICE_PER_PERSON,
  type BudgetId,
  type CategoryId,
  type Zone,
} from '@/lib/data'

export interface TripItem {
  experienceId: string
  day: number
  startHour: number
  pickup?: 'recoger' | 'envio'
}

export interface TripState {
  startDate: string | null
  endDate: string | null
  people: number
  zone: Zone | null
  lodging: string
  budget: BudgetId | null
  categories: CategoryId[]
  needsTransport: boolean | null
  transportEnabled: boolean
  items: TripItem[]
  packageId: string | null
  packageTransport: boolean
  confirmed: boolean
  confirmationCode: string | null
}

type Action =
  | { type: 'setDates'; startDate: string; endDate: string }
  | { type: 'setPeople'; people: number }
  | { type: 'setLodging'; zone: Zone; lodging: string }
  | { type: 'setBudget'; budget: BudgetId }
  | { type: 'setCategories'; categories: CategoryId[] }
  | { type: 'setNeedsTransport'; needs: boolean }
  | { type: 'setTransportEnabled'; enabled: boolean }
  | { type: 'addExperience'; experienceId: string }
  | { type: 'removeExperience'; experienceId: string }
  | { type: 'setPickup'; experienceId: string; pickup: 'recoger' | 'envio' }
  | { type: 'selectPackage'; packageId: string; transport: boolean }
  | { type: 'setPackageTransport'; transport: boolean }
  | { type: 'clearPackage' }
  | { type: 'confirm' }
  | { type: 'reset' }

const initialState: TripState = {
  startDate: null,
  endDate: null,
  people: 2,
  zone: null,
  lodging: '',
  budget: null,
  categories: [],
  needsTransport: null,
  transportEnabled: false,
  items: [],
  packageId: null,
  packageTransport: false,
  confirmed: false,
  confirmationCode: null,
}

function scheduleItems(items: TripItem[]): TripItem[] {
  // Rebuild the schedule chronologically: daytime activities fill days in
  // order, night activities always land at 19:30 on the day they belong to.
  const daytime = items.filter((i) => !EXPERIENCE_MAP[i.experienceId]?.isNight)
  const night = items.filter((i) => EXPERIENCE_MAP[i.experienceId]?.isNight)
  const result: TripItem[] = []
  let day = 1
  let hour = 9
  for (const item of daytime) {
    const exp = EXPERIENCE_MAP[item.experienceId]
    const duration = exp?.durationHours ?? 2
    if (hour + duration > 18) {
      day += 1
      hour = 9
    }
    result.push({ ...item, day, startHour: hour })
    hour += duration + 1
  }
  let nightDay = 1
  for (const item of night) {
    result.push({ ...item, day: nightDay, startHour: 19.5 })
    nightDay += 1
  }
  return result.sort((a, b) => a.day - b.day || a.startHour - b.startHour)
}

function reducer(state: TripState, action: Action): TripState {
  switch (action.type) {
    case 'setDates':
      return { ...state, startDate: action.startDate, endDate: action.endDate }
    case 'setPeople':
      return { ...state, people: Math.min(12, Math.max(1, action.people)) }
    case 'setLodging':
      return { ...state, zone: action.zone, lodging: action.lodging }
    case 'setBudget':
      return { ...state, budget: action.budget }
    case 'setCategories':
      return { ...state, categories: action.categories }
    case 'setNeedsTransport':
      return { ...state, needsTransport: action.needs, transportEnabled: action.needs }
    case 'setTransportEnabled':
      return { ...state, transportEnabled: action.enabled }
    case 'addExperience': {
      if (state.items.some((i) => i.experienceId === action.experienceId)) return state
      const items = scheduleItems([
        ...state.items,
        { experienceId: action.experienceId, day: 1, startHour: 9 },
      ])
      return { ...state, items, confirmed: false }
    }
    case 'removeExperience':
      return {
        ...state,
        items: scheduleItems(state.items.filter((i) => i.experienceId !== action.experienceId)),
      }
    case 'setPickup':
      return {
        ...state,
        items: state.items.map((i) =>
          i.experienceId === action.experienceId ? { ...i, pickup: action.pickup } : i,
        ),
      }
    case 'selectPackage':
      return { ...state, packageId: action.packageId, packageTransport: action.transport, confirmed: false }
    case 'setPackageTransport':
      return { ...state, packageTransport: action.transport }
    case 'clearPackage':
      return { ...state, packageId: null, packageTransport: false }
    case 'confirm':
      return {
        ...state,
        confirmed: true,
        confirmationCode: `CT-${Math.random().toString(36).slice(2, 8).toUpperCase()}`,
      }
    case 'reset':
      return initialState
    default:
      return state
  }
}

interface TripContextValue {
  state: TripState
  dispatch: (action: Action) => void
  totals: {
    experiences: number
    transport: number
    packagePrice: number
    total: number
    itemCount: number
  }
  hasItem: (experienceId: string) => boolean
}

const TripContext = createContext<TripContextValue | null>(null)

export function TripProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState)

  const value = useMemo<TripContextValue>(() => {
    const experiences = state.items.reduce(
      (sum, i) => sum + (EXPERIENCE_MAP[i.experienceId]?.price ?? 0) * state.people,
      0,
    )
    const pkg = PACKAGES.find((p) => p.id === state.packageId)
    const packagePrice = pkg ? pkg.price * state.people : 0
    const days = new Set(state.items.map((i) => i.day)).size
    const customTransport = state.transportEnabled
      ? TRANSPORT_PRICE_PER_PERSON * state.people * Math.max(1, days)
      : 0
    const packageTransport = pkg && state.packageTransport ? pkg.transportPrice * state.people : 0
    const transport = customTransport + packageTransport
    return {
      state,
      dispatch,
      totals: {
        experiences,
        transport,
        packagePrice,
        total: experiences + packagePrice + transport,
        itemCount: state.items.length + (pkg ? 1 : 0),
      },
      hasItem: (id) => state.items.some((i) => i.experienceId === id),
    }
  }, [state])

  return <TripContext.Provider value={value}>{children}</TripContext.Provider>
}

export function useTrip() {
  const ctx = useContext(TripContext)
  if (!ctx) throw new Error('useTrip must be used within TripProvider')
  return ctx
}
