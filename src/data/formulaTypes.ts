export interface Formula {
  /** unique within the module */
  id: string
  name: string
  /** Turkish name, if the notes give one */
  tr?: string
  /** LaTeX (display) */
  tex: string
  /** variable explanations; may contain $inline$ math */
  vars: string[]
  /** when the formula applies; may contain $inline$ math */
  conditions: string
  /** heading id (slug) of the lesson section that explains it */
  section: string
  /** anchor id of a worked example using it, e.g. "ex-rc-circuit-step-response" */
  example?: string
  /** page(s) in the lecture notes */
  page?: string
  /** show in the module's key-formula sidebar */
  key?: boolean
}
