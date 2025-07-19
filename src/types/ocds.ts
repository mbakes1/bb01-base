export interface OCDSRelease {
  ocid: string
  date: string
  language?: string
  tag?: string[]
  tender?: Tender
  buyer?: Organization
}

export interface Tender {
  id?: string
  title?: string
  description?: string
  procurementMethod?: string
  procurementMethodDetails?: string
  mainProcurementCategory?: string
  additionalProcurementCategories?: string[]
  tenderPeriod?: Period
  procuringEntity?: Organization
  value?: Value
  documents?: Document[]
}

export interface Organization {
  id?: string
  name?: string
}

export interface Period {
  startDate?: string
  endDate?: string
}

export interface Value {
  amount?: number
  currency?: string
}

export interface Document {
  id?: string
  title?: string
  description?: string
  url?: string
  format?: string
  datePublished?: string
  dateModified?: string
}

export interface ReleasesResponse {
  releases: OCDSRelease[]
}