import { useState, useRef, useEffect } from 'react'
import {
  Eye, Home, HelpCircle, ChevronLeft, ChevronDown, ChevronRight,
  X, Check, CheckCircle, AlertTriangle, Clock, Upload, Calendar,
  FileText, Shield, Info, BookOpen, Building2, Scale, Mail
} from 'lucide-react'

// ─── Data ────────────────────────────────────────────────────────────────────

const PROPERTIES = [
  {
    id: 'meadow',
    name: 'Meadow Cottage',
    location: 'Lower Mill Estate',
    beds: 2,
    heating: 'Gas heating, log burner',
    status: 'amber',
    score: '12 of 13',
    worstItem: null,
    amberNote: 'Gas safety cert expires in 18 days',
    items: [
      { id: 'fra', name: 'Fire risk assessment', status: 'green', lastDate: '14 Mar 2025', nextDate: '14 Mar 2026', detail: 'Last: 14 Mar 2025. Next review: 14 Mar 2026', whatIs: 'A fire risk assessment identifies fire hazards in your property and who might be at risk. It must be reviewed regularly.', whoCanDo: 'A competent person — ideally a qualified fire risk assessor registered with a professional body.', legalRef: 'Regulatory Reform (Fire Safety) Order 2005' },
      { id: 'smoke', name: 'Smoke alarm test', status: 'green', lastDate: '28 Feb 2026', detail: 'Last changeover: 28 Feb 2026', whatIs: 'Smoke alarms must be tested at every changeover to ensure they are working. Press the test button and confirm the alarm sounds.', whoCanDo: 'Anyone — your cleaner or property manager can do this at changeover.', legalRef: 'Smoke and Carbon Monoxide Alarm (Amendment) Regulations 2022' },
      { id: 'co', name: 'Carbon monoxide alarm test', status: 'green', lastDate: '28 Feb 2026', detail: 'Last changeover: 28 Feb 2026', whatIs: 'CO alarms are required in any room with a fixed combustion appliance (boiler, log burner, gas fire). Test at every changeover.', whoCanDo: 'Anyone — your cleaner or property manager.', legalRef: 'Smoke and Carbon Monoxide Alarm (Amendment) Regulations 2022' },
      { id: 'emergency-light', name: 'Emergency lighting check', status: 'green', lastDate: '28 Feb 2026', detail: 'Last changeover: 28 Feb 2026', whatIs: 'Emergency lighting must illuminate escape routes if the main power fails. Check they are working at each changeover.', whoCanDo: 'Anyone at changeover. Annual professional inspection recommended.', legalRef: 'BS 5266-1' },
      { id: 'escape', name: 'Escape route check', status: 'green', lastDate: '28 Feb 2026', detail: 'Last changeover: 28 Feb 2026', whatIs: 'All escape routes must be clear and unobstructed. Doors on escape routes must open without a key from the inside.', whoCanDo: 'Anyone at changeover.', legalRef: 'Regulatory Reform (Fire Safety) Order 2005' },
      { id: 'fire-door', name: 'Fire door check', status: 'green', lastDate: '28 Feb 2026', detail: 'Last changeover: 28 Feb 2026', whatIs: 'Fire doors must close fully into the frame. Check that hinges, seals, and self-closers are intact and working.', whoCanDo: 'Anyone at changeover. Professional inspection every 6 months recommended.', legalRef: 'Regulatory Reform (Fire Safety) Order 2005' },
      { id: 'blanket', name: 'Fire blanket present', status: 'green', lastDate: '28 Feb 2026', detail: 'Last changeover: 28 Feb 2026', whatIs: 'A fire blanket should be mounted in or near the kitchen, easily accessible and clearly visible to guests.', whoCanDo: 'Anyone — just confirm it is present and accessible.', legalRef: 'Best practice for holiday lets' },
      { id: 'guest-info', name: 'Guest fire safety info provided', status: 'green', lastDate: '28 Feb 2026', detail: 'Last changeover: 28 Feb 2026', whatIs: 'Guests must be given clear fire safety information: escape routes, alarm locations, assembly point, and emergency numbers.', whoCanDo: 'You — include it in your welcome pack or display it prominently in the property.', legalRef: 'Regulatory Reform (Fire Safety) Order 2005' },
      { id: 'gas', name: 'Gas boiler safety check', status: 'amber', lastDate: '24 Mar 2025', nextDate: '24 Mar 2026', detail: 'Expires: 24 Mar 2026 (18 days). Last: 24 Mar 2025', whatIs: 'A Gas Safety Certificate (CP12) must be renewed every 12 months by a Gas Safe registered engineer.', whoCanDo: 'A Gas Safe registered engineer only.', findProvider: 'https://www.gassaferegister.co.uk', legalRef: 'Gas Safety (Installation and Use) Regulations 1998' },
      { id: 'chimney', name: 'Chimney sweep (log burner)', status: 'green', lastDate: '12 Jan 2026', nextDate: 'Jul 2026', detail: 'Last: 12 Jan 2026. Next: Jul 2026', whatIs: 'Chimneys serving solid fuel appliances should be swept at least once a year, ideally before the start of the heating season.', whoCanDo: 'A qualified chimney sweep — look for HETAS or Guild of Master Chimney Sweeps certification.', legalRef: 'Best practice / insurance requirement' },
      { id: 'eicr', name: 'Electrical installation check (EICR)', status: 'green', lastDate: '8 Sep 2023', nextDate: 'Sep 2028', detail: 'Last: 8 Sep 2023. Next: Sep 2028', whatIs: 'An EICR checks the fixed electrical installation (wiring, sockets, consumer unit) is safe. Valid for 5 years.', whoCanDo: 'A qualified electrician registered with a competent person scheme (e.g. NICEIC, NAPIT).', legalRef: 'Electrical Safety Standards in the Private Rented Sector (England) Regulations 2020' },
      { id: 'pat', name: 'Portable appliance testing (PAT)', status: 'green', lastDate: '14 Mar 2025', nextDate: 'Mar 2026', detail: 'Last: 14 Mar 2025. Next: Mar 2026', whatIs: 'PAT testing checks portable electrical appliances (kettles, lamps, etc.) are safe. Recommended annually for holiday lets.', whoCanDo: 'A competent person — many electricians and specialist PAT testing companies offer this.', legalRef: 'Health and Safety at Work Act 1974 (duty of care)' },
      { id: 'furniture', name: 'Furniture fire safety compliance', status: 'green', lastDate: '14 Mar 2025', detail: 'Confirmed: 14 Mar 2025', whatIs: 'All upholstered furniture must meet fire resistance requirements and carry the appropriate labels.', whoCanDo: 'You — check labels on all upholstered furniture. Replace non-compliant items.', legalRef: 'Furniture and Furnishings (Fire Safety) Regulations 1988' },
    ],
  },
  {
    id: 'barn',
    name: 'The Barn',
    location: 'Cirencester',
    beds: 3,
    heating: 'Oil heating',
    status: 'red',
    score: '9 of 11',
    worstItem: 'Fire risk assessment overdue by 45 days',
    items: [
      { id: 'fra', name: 'Fire risk assessment', status: 'red', lastDate: '22 Jan 2024', nextDate: '22 Jan 2025', detail: 'Overdue by 45 days. Last: 22 Jan 2024', whatIs: 'A fire risk assessment identifies fire hazards in your property and who might be at risk. It must be reviewed regularly.', whoCanDo: 'A competent person — ideally a qualified fire risk assessor.', legalRef: 'Regulatory Reform (Fire Safety) Order 2005' },
      { id: 'smoke', name: 'Smoke alarm test', status: 'green', lastDate: '1 Mar 2026', detail: 'Last changeover: 1 Mar 2026', whatIs: 'Smoke alarms must be tested at every changeover.', whoCanDo: 'Anyone at changeover.', legalRef: 'Smoke and Carbon Monoxide Alarm (Amendment) Regulations 2022' },
      { id: 'co', name: 'Carbon monoxide alarm test', status: 'green', lastDate: '1 Mar 2026', detail: 'Last changeover: 1 Mar 2026', whatIs: 'CO alarms required in rooms with combustion appliances.', whoCanDo: 'Anyone at changeover.', legalRef: 'Smoke and Carbon Monoxide Alarm (Amendment) Regulations 2022' },
      { id: 'emergency-light', name: 'Emergency lighting check', status: 'green', lastDate: '1 Mar 2026', detail: 'Last changeover: 1 Mar 2026', whatIs: 'Emergency lighting must illuminate escape routes if the main power fails.', whoCanDo: 'Anyone at changeover.', legalRef: 'BS 5266-1' },
      { id: 'escape', name: 'Escape route check', status: 'green', lastDate: '1 Mar 2026', detail: 'Last changeover: 1 Mar 2026', whatIs: 'All escape routes must be clear and unobstructed.', whoCanDo: 'Anyone at changeover.', legalRef: 'Regulatory Reform (Fire Safety) Order 2005' },
      { id: 'fire-door', name: 'Fire door check', status: 'green', lastDate: '1 Mar 2026', detail: 'Last changeover: 1 Mar 2026', whatIs: 'Fire doors must close fully into the frame.', whoCanDo: 'Anyone at changeover.', legalRef: 'Regulatory Reform (Fire Safety) Order 2005' },
      { id: 'blanket', name: 'Fire blanket present', status: 'green', lastDate: '1 Mar 2026', detail: 'Last changeover: 1 Mar 2026', whatIs: 'A fire blanket should be mounted in or near the kitchen.', whoCanDo: 'Anyone.', legalRef: 'Best practice' },
      { id: 'guest-info', name: 'Guest fire safety info provided', status: 'green', lastDate: '1 Mar 2026', detail: 'Last changeover: 1 Mar 2026', whatIs: 'Guests must be given clear fire safety information.', whoCanDo: 'You — include it in your welcome pack.', legalRef: 'Regulatory Reform (Fire Safety) Order 2005' },
      { id: 'oil', name: 'Oil boiler service', status: 'green', lastDate: '15 Nov 2025', nextDate: 'Nov 2026', detail: 'Last: 15 Nov 2025. Next: Nov 2026', whatIs: 'Oil boilers should be serviced annually by a qualified OFTEC registered technician.', whoCanDo: 'An OFTEC registered technician.', legalRef: 'Best practice / insurance requirement' },
      { id: 'eicr', name: 'Electrical installation check (EICR)', status: 'red', lastDate: '6 Dec 2019', nextDate: 'Dec 2024', detail: 'Overdue by 3 months. Last: 6 Dec 2019', whatIs: 'An EICR checks the fixed electrical installation is safe. Valid for 5 years.', whoCanDo: 'A qualified electrician registered with a competent person scheme.', legalRef: 'Electrical Safety Standards in the Private Rented Sector (England) Regulations 2020' },
      { id: 'furniture', name: 'Furniture fire safety compliance', status: 'green', lastDate: '22 Jan 2024', detail: 'Confirmed: 22 Jan 2024', whatIs: 'All upholstered furniture must meet fire resistance requirements.', whoCanDo: 'You — check labels on all furniture.', legalRef: 'Furniture and Furnishings (Fire Safety) Regulations 1988' },
    ],
  },
  {
    id: 'flat4',
    name: 'Flat 4',
    location: 'Cheltenham',
    beds: 1,
    heating: 'Electric only',
    status: 'green',
    score: '8 of 8',
    worstItem: null,
    items: [
      { id: 'fra', name: 'Fire risk assessment', status: 'green', lastDate: '3 Feb 2025', nextDate: '3 Feb 2026', detail: 'Last: 3 Feb 2025. Next review: 3 Feb 2026', whatIs: 'A fire risk assessment identifies fire hazards.', whoCanDo: 'A qualified fire risk assessor.', legalRef: 'Regulatory Reform (Fire Safety) Order 2005' },
      { id: 'smoke', name: 'Smoke alarm test', status: 'green', lastDate: '2 Mar 2026', detail: 'Last changeover: 2 Mar 2026', whatIs: 'Smoke alarms must be tested at every changeover.', whoCanDo: 'Anyone at changeover.', legalRef: 'Smoke and Carbon Monoxide Alarm (Amendment) Regulations 2022' },
      { id: 'emergency-light', name: 'Emergency lighting check', status: 'green', lastDate: '2 Mar 2026', detail: 'Last changeover: 2 Mar 2026', whatIs: 'Emergency lighting must illuminate escape routes.', whoCanDo: 'Anyone at changeover.', legalRef: 'BS 5266-1' },
      { id: 'escape', name: 'Escape route check', status: 'green', lastDate: '2 Mar 2026', detail: 'Last changeover: 2 Mar 2026', whatIs: 'All escape routes must be clear and unobstructed.', whoCanDo: 'Anyone at changeover.', legalRef: 'Regulatory Reform (Fire Safety) Order 2005' },
      { id: 'guest-info', name: 'Guest fire safety info provided', status: 'green', lastDate: '2 Mar 2026', detail: 'Last changeover: 2 Mar 2026', whatIs: 'Guests must be given fire safety information.', whoCanDo: 'You.', legalRef: 'Regulatory Reform (Fire Safety) Order 2005' },
      { id: 'eicr', name: 'Electrical installation check (EICR)', status: 'green', lastDate: '20 Jun 2024', nextDate: 'Jun 2029', detail: 'Last: 20 Jun 2024. Next: Jun 2029', whatIs: 'An EICR checks the fixed electrical installation is safe.', whoCanDo: 'A qualified electrician.', legalRef: 'Electrical Safety Standards in the Private Rented Sector (England) Regulations 2020' },
      { id: 'pat', name: 'Portable appliance testing (PAT)', status: 'green', lastDate: '3 Feb 2025', nextDate: 'Feb 2026', detail: 'Last: 3 Feb 2025. Next: Feb 2026', whatIs: 'PAT testing checks portable appliances are safe.', whoCanDo: 'A competent person.', legalRef: 'Health and Safety at Work Act 1974' },
      { id: 'furniture', name: 'Furniture fire safety compliance', status: 'green', lastDate: '3 Feb 2025', detail: 'Confirmed: 3 Feb 2025', whatIs: 'All upholstered furniture must meet fire resistance requirements.', whoCanDo: 'You — check labels.', legalRef: 'Furniture and Furnishings (Fire Safety) Regulations 1988' },
    ],
  },
]

const CHANGEOVER_ITEMS = [
  { id: 'c-smoke', label: 'Smoke alarms tested and working', tip: 'Tip: film a short video showing you pressing the test button and the alarm sounding. Upload it as evidence.' },
  { id: 'c-co', label: 'Carbon monoxide alarms tested and working' },
  { id: 'c-emergency', label: 'Emergency lighting working' },
  { id: 'c-escape', label: 'All escape routes clear and unobstructed' },
  { id: 'c-doors', label: 'Exit doors open without a key' },
  { id: 'c-firedoor', label: 'Fire doors closing properly' },
  { id: 'c-blanket', label: 'Fire blanket present in kitchen' },
  { id: 'c-extinguisher', label: 'Fire extinguisher present and in date' },
  { id: 'c-info', label: 'Guest fire safety information displayed' },
  { id: 'c-candles', label: 'No candles left in property' },
]

const HELP_TOPICS = [
  { q: 'How do I add a property?', a: 'From the dashboard, tap "Add property" and enter the address, number of bedrooms, and heating type. The compliance checklist is automatically generated based on what applies to your property.' },
  { q: 'How do I upload a certificate?', a: 'Go to your property\'s compliance page. Find the relevant item (e.g. Gas Safety Certificate). Tap "Update". Use the "Upload evidence" button to attach a photo or PDF of the certificate. Accepted formats: JPG, PNG, PDF. Maximum size: 100MB.' },
  { q: 'How do I record a fire alarm test?', a: 'Go to your property\'s compliance page. Find "Smoke alarm test" in the checklist. Tap "Update". Film a short video on your phone showing you pressing the test button and the alarm sounding. Tap "Upload evidence" and select the video. Accepted formats: MP4, MOV, or WEBM. Maximum size: 100MB.' },
  { q: 'How do I complete a changeover check?', a: 'Open your property\'s compliance page and tap "Start changeover check". Work through each item on the checklist, ticking each one as you confirm it. You can add notes and upload evidence for each item. Once all items are ticked, tap "Submit check" to record the changeover.' },
  { q: 'How do I download a compliance report?', a: 'From your property\'s compliance page, tap the "Download report" option. This generates a PDF summary of all compliance items, their status, and evidence records. Useful for sharing with insurers or local authorities.' },
  { q: 'What do the green, amber, and red badges mean?', a: 'Green means the item is up to date and compliant. Amber means the item is due for renewal within 30 days — take action soon. Red means the item is overdue and your property may not be compliant — take action immediately.' },
]

const LEGISLATION = {
  current: [
    { title: 'Regulatory Reform (Fire Safety) Order 2005', summary: 'The responsible person (owner, agent, or person in control) must carry out a fire risk assessment, record it in writing, and review it periodically. Premises must have suitable fire detection, warning systems, emergency lighting, adequate escape routes, and fire doors providing 30-minute resistance on escape routes. Fire safety equipment and exit routes must be checked at every guest changeover.', ref: 'SI 2005/1541. Written recording requirement added by Building Safety Act 2022 s.156, in force 1 October 2023.' },
    { title: 'Gas Safety (Installation and Use) Regulations 1998', summary: 'Every gas appliance and flue must be checked annually by a Gas Safe registered engineer. A Gas Safety Certificate (CP12) must be issued and a copy displayed in the property for lets under 28 days. Records must be retained until two further checks are completed. The annual check can be carried out up to 2 months early while retaining the anniversary date.', ref: 'SI 1998/2451, Regulation 36.' },
    { title: 'Smoke and carbon monoxide alarms', summary: 'A smoke alarm is required on every storey used as living accommodation. A carbon monoxide alarm is required in any room with a fixed combustion appliance (excluding gas cookers). Alarms must be tested at every changeover. Note: the Smoke and Carbon Monoxide Alarm Regulations 2015/2022 are tenancy-based and may not directly apply to holiday lets, but these requirements arise independently under the Fire Safety Order 2005 and associated guidance.', ref: 'Regulatory Reform (Fire Safety) Order 2005; GOV.UK guidance updated January 2025.' },
    { title: 'Furniture and Furnishings (Fire Safety) Regulations 1988', summary: 'All upholstered furniture, beds, mattresses, cushions, and pillows provided in a holiday let must meet specified ignition resistance levels and carry a permanent compliance label. The 2025 amendment (in force 30 October 2025) removed display/swing label requirements and extended the prosecution time limit from 6 to 12 months.', ref: 'SI 1988/1324, amended by SI 2025/531.' },
    { title: 'Electrical Installation Condition Report (EICR)', summary: 'The Electrical Safety Standards Regulations 2020 apply to tenancies, not holiday lets in England. However, holiday let operators have a general duty of care under the Occupiers\' Liability Act 1957 and the Fire Safety Order to ensure all electrical installations are safe. In Scotland, a valid EICR is mandatory for all short-term lets under licensing (from 1 July 2024).', ref: 'SI 2020/312 (England tenancies only); Occupiers\' Liability Act 1957.' },
    { title: 'Occupiers\' Liability Act 1957', summary: 'Holiday let operators owe a common duty of care to all visitors (paying guests) to ensure the premises are reasonably safe for the purposes for which they are permitted to be there.', ref: 'Occupiers\' Liability Act 1957, s.2.' },
  ],
  upcoming: [
    { title: 'Short-Term Lets Registration Scheme (England)', summary: 'A mandatory national registration scheme for all short-term lets in England is targeted to launch in spring 2026. Hosts will need to submit property details and safety compliance documentation. Each property will receive a unique registration number that must be displayed on all platform listings. Platforms will be prohibited from listing unregistered properties. Civil penalties of up to £5,000 for non-registration.', ref: 'DCMS consultation response, 2024. GOV.UK guidance published.' },
    { title: 'Building Safety Act 2022, Section 156', summary: 'In force since 1 October 2023. All responsible persons must record their fire risk assessment in full in writing, regardless of premises size. The identity of the assessor must also be recorded. Penalties for non-compliance increased to unlimited fines for certain offences.', ref: 'Building Safety Act 2022, s.156.' },
    { title: 'Furniture Regulations 2025 Amendment', summary: 'In force since 30 October 2025. Display and swing labels on new furniture are no longer required. Certain small baby and children\'s products are exempted. The prosecution time limit extended from 6 to 12 months. Existing compliant products can continue to be sold indefinitely.', ref: 'SI 2025/531.' },
    { title: 'Scotland: Short-Term Lets Licensing', summary: 'Mandatory from 1 January 2025 for all short-term let accommodation in Scotland. Licensing conditions include mandatory EICR, PAT testing, gas safety certificates, and fire risk assessments. Non-compliance can result in fines up to £2,500 and an immediate ban from operating.', ref: 'The Civic Government (Scotland) Act 1982 (Licensing of Short-term Lets) Order 2022.' },
  ],
  bestPractice: [
    { title: 'EICR every 5 years', summary: 'Although not legally mandated for holiday lets in England, obtaining an Electrical Installation Condition Report every 5 years is the single most widely recommended best practice. It demonstrates due diligence and is required by most insurers.' },
    { title: 'PAT test portable appliances annually', summary: 'Test all portable electrical appliances (kettles, lamps, toasters, etc.) at appropriate intervals based on usage and risk. Keep records of all tests.' },
    { title: 'Fire blanket and extinguisher', summary: 'Provide a fire blanket in the kitchen and a suitable fire extinguisher (foam or CO2, not multi-purpose powder). Include clear instructions and a warning not to tackle anything other than very small fires.' },
    { title: 'Interlinked mains-wired alarms', summary: 'Install interlinked smoke and heat alarms (mains-wired with battery backup) even where only standalone alarms are required. Use heat alarms in kitchens instead of smoke alarms to reduce false alarms. Install CO alarms in all rooms with any fuel-burning appliance.' },
    { title: 'Guest fire safety information', summary: 'Display a clear fire action notice in each bedroom and hallway. Provide a property-specific fire safety information sheet covering alarm locations, escape routes, assembly point, fire extinguisher and blanket locations, and emergency contact numbers.' },
    { title: 'Escape route design', summary: 'Ensure all windows intended as emergency escape can be opened without a key. Fit thumb-turn locks on final exit doors so guests can exit without a key in an emergency. Keep external escape routes well lit and free from obstruction.' },
    { title: 'Fire safety log and documentation', summary: 'Maintain a fire safety log on-site including the fire risk assessment, gas safety certificate, electrical records, alarm test records, and equipment servicing records. Keep photographic records of furniture compliance labels. Review the fire risk assessment at least annually.' },
  ],
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function StatusBadge({ status, className = '' }) {
  const styles = {
    green: 'bg-emerald-100 text-emerald-700',
    amber: 'bg-amber-100 text-amber-700',
    red: 'bg-red-100 text-red-700',
    grey: 'bg-slate-100 text-slate-500',
  }
  const labels = { green: 'Up to date', amber: 'Due soon', red: 'Overdue', grey: 'N/A' }
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${styles[status] || styles.grey} ${className}`}>
      {labels[status] || status}
    </span>
  )
}

function Toast({ message, onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 2000)
    return () => clearTimeout(t)
  }, [onClose])
  return (
    <div className="fixed bottom-20 left-1/2 -translate-x-1/2 bg-slate-900 text-white px-4 py-2 rounded-lg shadow-lg text-sm flex items-center gap-2 z-50">
      <Check className="w-4 h-4 text-emerald-400" /> {message}
    </div>
  )
}

// ─── App ─────────────────────────────────────────────────────────────────────

function App() {
  const [screen, setScreen] = useState('dashboard')
  const [activeTab, setActiveTab] = useState('dashboard')
  const [selectedProperty, setSelectedProperty] = useState(null)
  const [expandedItems, setExpandedItems] = useState({})
  const [showUpdateModal, setShowUpdateModal] = useState(null)
  const [toast, setToast] = useState(null)
  const [disclaimerDismissed, setDisclaimerDismissed] = useState(false)
  const [changeoverChecks, setChangeoverChecks] = useState({})
  const [changeoverNotes, setChangeoverNotes] = useState({})
  const [changeoverExpanded, setChangeoverExpanded] = useState({})
  const [changeoverDone, setChangeoverDone] = useState(false)
  const barnRef = useRef(null)

  const navigateTo = (s, tab) => {
    setScreen(s)
    if (tab) setActiveTab(tab)
  }

  const openProperty = (prop) => {
    setSelectedProperty(prop)
    setExpandedItems({})
    setScreen('detail')
  }

  const startChangeover = () => {
    setChangeoverChecks({})
    setChangeoverNotes({})
    setChangeoverExpanded({})
    setChangeoverDone(false)
    setScreen('changeover')
  }

  const toggleExpand = (id) => {
    setExpandedItems(prev => ({ ...prev, [id]: !prev[id] }))
  }

  const toggleChangeoverExpand = (id) => {
    setChangeoverExpanded(prev => ({ ...prev, [id]: !prev[id] }))
  }

  const allChecked = CHANGEOVER_ITEMS.every(i => changeoverChecks[i.id])

  const hasRedItems = PROPERTIES.some(p => p.status === 'red')
  const redCount = PROPERTIES.reduce((acc, p) => acc + p.items.filter(i => i.status === 'red').length, 0)

  // ─── Dashboard ──────────────────────────────────────────────────────────

  const Dashboard = () => (
    <div className="max-w-3xl mx-auto space-y-4">
      {hasRedItems && (
        <button
          onClick={() => openProperty(PROPERTIES.find(p => p.status === 'red'))}
          className="w-full bg-red-50 border border-red-200 rounded-lg p-3 flex items-center gap-3 text-left"
        >
          <AlertTriangle className="w-5 h-5 text-red-600 shrink-0" />
          <span className="text-sm text-red-800">
            <span className="font-medium">{redCount} item{redCount !== 1 ? 's' : ''} overdue</span> across your properties. Review now.
          </span>
          <ChevronRight className="w-4 h-4 text-red-400 ml-auto shrink-0" />
        </button>
      )}

      {PROPERTIES.map((prop) => (
        <button
          key={prop.id}
          ref={prop.id === 'barn' ? barnRef : null}
          onClick={() => openProperty(prop)}
          className="w-full bg-white border border-slate-200 rounded-lg p-4 text-left hover:border-slate-300 transition-colors"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h3 className="font-semibold text-slate-900 truncate">{prop.name}</h3>
              <p className="text-sm text-slate-500">{prop.location} &middot; {prop.beds} bed &middot; {prop.heating}</p>
            </div>
            <StatusBadge status={prop.status} />
          </div>
          <div className="mt-3 flex items-center justify-between">
            <span className="text-sm text-slate-600">{prop.score} items up to date</span>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </div>
          {prop.status === 'red' && prop.worstItem && (
            <p className="mt-2 text-xs text-red-600 font-medium">{prop.worstItem}</p>
          )}
          {prop.status === 'amber' && prop.amberNote && (
            <p className="mt-2 text-xs text-amber-600 font-medium">{prop.amberNote}</p>
          )}
        </button>
      ))}

      {!disclaimerDismissed && (
        <div className="bg-slate-100 border border-slate-200 rounded-lg p-4 relative">
          <button onClick={() => setDisclaimerDismissed(true)} className="absolute top-2 right-2 text-slate-400 hover:text-slate-600">
            <X className="w-4 h-4" />
          </button>
          <p className="text-xs text-slate-600 pr-6">
            This tool helps you track your compliance obligations. It does not replace a professional fire risk assessment or certify compliance. You are responsible for staying up to date with legislation.
          </p>
        </div>
      )}
    </div>
  )

  // ─── Property Detail ────────────────────────────────────────────────────

  const PropertyDetail = () => {
    if (!selectedProperty) return null
    const prop = selectedProperty
    return (
      <div className="max-w-3xl mx-auto space-y-4">
        <button onClick={() => navigateTo('dashboard', 'dashboard')} className="flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700 mb-2">
          <ChevronLeft className="w-4 h-4" /> Back to dashboard
        </button>

        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-xl font-semibold">{prop.name}</h2>
            <p className="text-sm text-slate-500">{prop.location} &middot; {prop.beds} bed &middot; {prop.heating}</p>
          </div>
          <StatusBadge status={prop.status} />
        </div>

        <button
          onClick={startChangeover}
          className="w-full bg-emerald-600 text-white rounded-lg py-3 px-4 font-medium text-sm hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2"
        >
          <CheckCircle className="w-4 h-4" /> Start changeover check
        </button>

        <div className="space-y-2">
          {prop.items.map((item) => (
            <div key={item.id} className="bg-white border border-slate-200 rounded-lg overflow-hidden">
              <div className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-sm text-slate-900">{item.name}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{item.detail}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <StatusBadge status={item.status} />
                    <button
                      onClick={() => setShowUpdateModal(item)}
                      className="text-xs text-emerald-600 font-medium hover:text-emerald-700 border border-emerald-200 rounded px-2 py-1"
                    >
                      Update
                    </button>
                  </div>
                </div>
                <button
                  onClick={() => toggleExpand(item.id)}
                  className="mt-2 flex items-center gap-1 text-xs text-slate-400 hover:text-slate-600"
                >
                  {expandedItems[item.id] ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                  What is this?
                </button>
              </div>
              {expandedItems[item.id] && (
                <div className="px-4 pb-4 border-t border-slate-100 pt-3 space-y-2 text-xs text-slate-600">
                  <p>{item.whatIs}</p>
                  <p><span className="font-medium text-slate-700">Who can do it:</span> {item.whoCanDo}</p>
                  {item.findProvider && (
                    <p><span className="font-medium text-slate-700">Find a provider:</span> <span className="text-emerald-600">{item.findProvider}</span></p>
                  )}
                  <p><span className="font-medium text-slate-700">Legal reference:</span> {item.legalRef}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    )
  }

  // ─── Update Modal ───────────────────────────────────────────────────────

  const UpdateModal = () => {
    if (!showUpdateModal) return null
    const item = showUpdateModal
    return (
      <div className="fixed inset-0 bg-black/40 flex items-end sm:items-center justify-center z-40 p-4">
        <div className="bg-white rounded-t-2xl sm:rounded-2xl w-full max-w-md max-h-[85vh] overflow-y-auto">
          <div className="p-4 border-b border-slate-200 flex items-center justify-between">
            <h3 className="font-semibold">Update: {item.name}</h3>
            <button onClick={() => { setShowUpdateModal(null); setToast('Saved') }} className="text-slate-400 hover:text-slate-600">
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="p-4 space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Date completed</label>
              <div className="flex items-center gap-2 border border-slate-200 rounded-lg p-2.5 text-sm text-slate-500">
                <Calendar className="w-4 h-4" /> Select date
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Expiry / next due date</label>
              <div className="flex items-center gap-2 border border-slate-200 rounded-lg p-2.5 text-sm text-slate-500">
                <Calendar className="w-4 h-4" /> Select date
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Notes</label>
              <textarea className="w-full border border-slate-200 rounded-lg p-2.5 text-sm resize-none h-20" placeholder="Add any notes..." />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Upload evidence</label>
              <div className="border-2 border-dashed border-slate-200 rounded-lg p-6 text-center">
                <Upload className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <p className="text-sm text-slate-500">Photos, PDFs, or video</p>
                <p className="text-xs text-slate-400 mt-1">Up to 100MB</p>
              </div>
            </div>
            <button
              onClick={() => { setShowUpdateModal(null); setToast('Saved') }}
              className="w-full bg-emerald-600 text-white rounded-lg py-2.5 font-medium text-sm hover:bg-emerald-700 transition-colors"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    )
  }

  // ─── Changeover Check ──────────────────────────────────────────────────

  const ChangeoverCheck = () => {
    if (changeoverDone) {
      return (
        <div className="max-w-3xl mx-auto text-center py-12">
          <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-emerald-600" />
          </div>
          <h2 className="text-xl font-semibold mb-2">Changeover check complete</h2>
          <p className="text-sm text-slate-500">
            Recorded at {new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })} by Sarah (Cleaner)
          </p>
          <button
            onClick={() => setScreen('detail')}
            className="mt-6 text-sm text-emerald-600 font-medium hover:text-emerald-700"
          >
            Back to property
          </button>
        </div>
      )
    }

    return (
      <div className="max-w-3xl mx-auto space-y-4">
        <button onClick={() => setScreen('detail')} className="flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700 mb-2">
          <ChevronLeft className="w-4 h-4" /> Back
        </button>

        <div>
          <h2 className="text-lg font-semibold">Changeover check: {selectedProperty?.name}</h2>
          <p className="text-sm text-slate-500">{new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</p>
        </div>

        <div className="space-y-2">
          {CHANGEOVER_ITEMS.map((item) => (
            <div key={item.id} className="bg-white border border-slate-200 rounded-lg overflow-hidden">
              <label className="flex items-start gap-3 p-4 cursor-pointer">
                <input
                  type="checkbox"
                  checked={!!changeoverChecks[item.id]}
                  onChange={() => setChangeoverChecks(prev => ({ ...prev, [item.id]: !prev[item.id] }))}
                  className="mt-0.5 w-5 h-5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 shrink-0 accent-emerald-600"
                />
                <span className={`text-sm ${changeoverChecks[item.id] ? 'text-slate-400 line-through' : 'text-slate-900'}`}>
                  {item.label}
                </span>
              </label>
              <div className="px-4 pb-1">
                <button
                  onClick={() => toggleChangeoverExpand(item.id)}
                  className="flex items-center gap-1 text-xs text-slate-400 hover:text-slate-600 mb-2"
                >
                  {changeoverExpanded[item.id] ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                  Notes & evidence
                </button>
              </div>
              {changeoverExpanded[item.id] && (
                <div className="px-4 pb-4 space-y-2">
                  {item.tip && (
                    <div className="bg-amber-50 border border-amber-200 rounded p-2 text-xs text-amber-800 flex items-start gap-2">
                      <Info className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                      {item.tip}
                    </div>
                  )}
                  <textarea
                    className="w-full border border-slate-200 rounded-lg p-2 text-sm resize-none h-16"
                    placeholder="Add notes..."
                    value={changeoverNotes[item.id] || ''}
                    onChange={(e) => setChangeoverNotes(prev => ({ ...prev, [item.id]: e.target.value }))}
                  />
                  <button className="text-xs text-emerald-600 font-medium flex items-center gap-1 hover:text-emerald-700">
                    <Upload className="w-3 h-3" /> Add evidence
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        <button
          onClick={() => setChangeoverDone(true)}
          disabled={!allChecked}
          className={`w-full rounded-lg py-3 px-4 font-medium text-sm transition-colors flex items-center justify-center gap-2 ${
            allChecked
              ? 'bg-emerald-600 text-white hover:bg-emerald-700'
              : 'bg-slate-200 text-slate-400 cursor-not-allowed'
          }`}
        >
          <CheckCircle className="w-4 h-4" /> Submit check
        </button>
      </div>
    )
  }

  // ─── Help ──────────────────────────────────────────────────────────────

  const HelpScreen = () => (
    <div className="max-w-3xl mx-auto space-y-2">
      <h2 className="text-xl font-semibold mb-4">Help</h2>
      {HELP_TOPICS.map((topic, i) => (
        <div key={i} className="bg-white border border-slate-200 rounded-lg overflow-hidden">
          <button
            onClick={() => toggleExpand(`help-${i}`)}
            className="w-full p-4 text-left flex items-center justify-between gap-3"
          >
            <span className="text-sm font-medium text-slate-900">{topic.q}</span>
            {expandedItems[`help-${i}`] ? <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" /> : <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />}
          </button>
          {expandedItems[`help-${i}`] && (
            <div className="px-4 pb-4 border-t border-slate-100 pt-3">
              <p className="text-sm text-slate-600">{topic.a}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  )

  // ─── Legislation ─────────────────────────────────────────────────────

  const LegislationSection = ({ title, icon, color, items }) => (
    <div className="space-y-2">
      <div className="flex items-center gap-2 mb-3">
        {icon}
        <h3 className="text-base font-semibold">{title}</h3>
      </div>
      {items.map((item, i) => (
        <div key={i} className="bg-white border border-slate-200 rounded-lg overflow-hidden">
          <button
            onClick={() => toggleExpand(`leg-${title}-${i}`)}
            className="w-full p-4 text-left flex items-start justify-between gap-3"
          >
            <div className="min-w-0">
              <span className="text-sm font-medium text-slate-900">{item.title}</span>
              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium ml-2 ${color}`}>{title === 'Current Requirements' ? 'Mandatory' : title === 'What\'s Coming' ? 'Upcoming' : 'Recommended'}</span>
            </div>
            {expandedItems[`leg-${title}-${i}`] ? <ChevronDown className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" /> : <ChevronRight className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />}
          </button>
          {expandedItems[`leg-${title}-${i}`] && (
            <div className="px-4 pb-4 border-t border-slate-100 pt-3 space-y-2">
              <p className="text-sm text-slate-600">{item.summary}</p>
              {item.ref && <p className="text-xs text-slate-400"><span className="font-medium text-slate-500">Reference:</span> {item.ref}</p>}
            </div>
          )}
        </div>
      ))}
    </div>
  )

  const LegislationScreen = () => (
    <div className="max-w-3xl mx-auto space-y-8">
      <div>
        <h2 className="text-xl font-semibold mb-1">UK Fire Safety Legislation</h2>
        <p className="text-sm text-slate-500">Factual summary for short-term holiday let operators in England. Scotland, Wales, and Northern Ireland have additional requirements.</p>
      </div>
      <LegislationSection
        title="Current Requirements"
        icon={<Scale className="w-5 h-5 text-emerald-600" />}
        color="bg-emerald-100 text-emerald-700"
        items={LEGISLATION.current}
      />
      <LegislationSection
        title="What's Coming"
        icon={<Clock className="w-5 h-5 text-amber-500" />}
        color="bg-amber-100 text-amber-700"
        items={LEGISLATION.upcoming}
      />
      <LegislationSection
        title="Best Practice"
        icon={<CheckCircle className="w-5 h-5 text-indigo-500" />}
        color="bg-indigo-100 text-indigo-700"
        items={LEGISLATION.bestPractice}
      />
      <div className="bg-slate-100 border border-slate-200 rounded-lg p-4">
        <p className="text-xs text-slate-500">This summary is for general information only. It does not constitute legal advice. Legislation changes frequently. Always consult a qualified fire safety professional and check the latest government guidance for your specific situation.</p>
      </div>
    </div>
  )

  // ─── About ─────────────────────────────────────────────────────────────

  const AboutScreen = () => (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-emerald-600 text-2xl leading-none font-bold">&Lambda;</span>
          <h2 className="text-xl font-semibold">stayd</h2>
        </div>
        <p className="text-lg text-slate-600 font-medium">Short stays reimagined.</p>
      </div>

      <div className="bg-white border border-slate-200 rounded-lg p-5 space-y-4">
        <h3 className="font-semibold text-slate-900">What we do</h3>
        <p className="text-sm text-slate-600">stayd is building a vertically integrated UK short stay rentals platform. We optimise revenue for property owners and agencies, provide an AI operating system for holiday letting management, and acquire agencies from founders seeking succession planning.</p>
        <p className="text-sm text-slate-600">We analyse demand signals, track competitor activity, identify seasonal opportunities, and provide owners with performance insights. We partner with local agencies, layering modern tools atop existing systems without forcing technology migration.</p>
        <p className="text-sm text-slate-600">We price on outcomes, not promises. We only do well when our owners and agency partners do well.</p>
      </div>

      <div className="bg-white border border-slate-200 rounded-lg p-5 space-y-4">
        <h3 className="font-semibold text-slate-900">Where this started</h3>
        <p className="text-sm text-slate-600">Founder Robin Smith brings two decades of enterprise software experience and 15 years as a holiday home owner. He initially optimised his own Cotswold Lakes property through demand-led pricing and multi-channel distribution, increasing gross yield from approximately 10% to over 20%.</p>
        <p className="text-sm text-slate-600">The UK short-term rental sector is a £4 billion-plus industry with 350+ independent agencies mostly using legacy systems. After industry research, Smith recognised that technology alone doesn't solve problems — change management does.</p>
        <p className="text-sm text-slate-600">stayd focuses on proving value through revenue optimisation and automation alongside existing agency systems, earning trust before expanding services.</p>
      </div>

      <div className="bg-white border border-slate-200 rounded-lg p-5 space-y-3">
        <h3 className="font-semibold text-slate-900">Get in touch</h3>
        <div className="flex items-center gap-2 text-sm text-slate-600">
          <Mail className="w-4 h-4 text-slate-400" />
          <a href="mailto:hello@stayd.uk" className="text-emerald-600 hover:text-emerald-700 font-medium">hello@stayd.uk</a>
        </div>
        <a href="https://www.stayd.uk" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-sm text-emerald-600 hover:text-emerald-700 font-medium">
          www.stayd.uk <ChevronRight className="w-3 h-3" />
        </a>
      </div>

      <div className="text-xs text-slate-400 space-y-0.5">
        <p>Stayd Group Ltd</p>
        <p>Registered in England & Wales, Company No. 17066767</p>
        <p>71-75 Shelton St, London WC2H 9JQ</p>
      </div>
    </div>
  )

  // ─── Render ────────────────────────────────────────────────────────────

  const renderScreen = () => {
    switch (screen) {
      case 'dashboard': return <Dashboard />
      case 'detail': return <PropertyDetail />
      case 'changeover': return <ChangeoverCheck />
      case 'help': return <HelpScreen />
      case 'legislation': return <LegislationScreen />
      case 'about': return <AboutScreen />
      default: return <Dashboard />
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-4 py-3">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <button onClick={() => { navigateTo('dashboard', 'dashboard'); setExpandedItems({}) }} className="flex items-center gap-2">
            <Eye className="w-6 h-6 text-emerald-600" />
            <div className="text-left">
              <h1 className="text-lg font-semibold leading-tight">Vigil</h1>
            </div>
          </button>
          <div className="flex items-center gap-4">
          {/* Desktop nav */}
          <nav className="hidden sm:flex items-center gap-1">
            <button
              onClick={() => { navigateTo('dashboard', 'dashboard'); setExpandedItems({}) }}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${activeTab === 'dashboard' ? 'bg-slate-100 text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}
            >
              Dashboard
            </button>
            <button
              onClick={() => { navigateTo('legislation', 'legislation'); setExpandedItems({}) }}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${activeTab === 'legislation' ? 'bg-slate-100 text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}
            >
              Legislation
            </button>
            <button
              onClick={() => { navigateTo('help', 'help'); setExpandedItems({}) }}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${activeTab === 'help' ? 'bg-slate-100 text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}
            >
              Help
            </button>
            <button
              onClick={() => { navigateTo('about', 'about'); setExpandedItems({}) }}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${activeTab === 'about' ? 'bg-slate-100 text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}
            >
              About
            </button>
          </nav>
          <a href="https://www.stayd.uk" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-sm font-semibold text-slate-700 hover:text-emerald-600 transition-colors">
            <span className="text-emerald-600 text-lg leading-none">&Lambda;</span> stayd
          </a>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 px-4 py-6 pb-24 sm:pb-6">
        {renderScreen()}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 px-4 py-4 hidden sm:block">
        <div className="max-w-3xl mx-auto text-center text-xs text-slate-500 space-y-1">
          <p>Vigil is a free compliance tracking tool provided by <a href="https://www.stayd.uk" target="_blank" rel="noopener noreferrer" className="font-medium text-slate-700 hover:text-emerald-600">stayd</a>. It does not constitute legal or fire safety advice.</p>
        </div>
      </footer>

      {/* Mobile bottom nav */}
      <nav className="sm:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 px-4 py-2 z-30">
        <div className="flex items-center justify-around">
          <button
            onClick={() => { navigateTo('dashboard', 'dashboard'); setExpandedItems({}) }}
            className={`flex flex-col items-center gap-0.5 py-1 px-2 ${activeTab === 'dashboard' ? 'text-emerald-600' : 'text-slate-400'}`}
          >
            <Home className="w-5 h-5" />
            <span className="text-[10px]">Dashboard</span>
          </button>
          <button
            onClick={() => { navigateTo('legislation', 'legislation'); setExpandedItems({}) }}
            className={`flex flex-col items-center gap-0.5 py-1 px-2 ${activeTab === 'legislation' ? 'text-emerald-600' : 'text-slate-400'}`}
          >
            <BookOpen className="w-5 h-5" />
            <span className="text-[10px]">Legislation</span>
          </button>
          <button
            onClick={() => { navigateTo('help', 'help'); setExpandedItems({}) }}
            className={`flex flex-col items-center gap-0.5 py-1 px-2 ${activeTab === 'help' ? 'text-emerald-600' : 'text-slate-400'}`}
          >
            <HelpCircle className="w-5 h-5" />
            <span className="text-[10px]">Help</span>
          </button>
          <button
            onClick={() => { navigateTo('about', 'about'); setExpandedItems({}) }}
            className={`flex flex-col items-center gap-0.5 py-1 px-2 ${activeTab === 'about' ? 'text-emerald-600' : 'text-slate-400'}`}
          >
            <Building2 className="w-5 h-5" />
            <span className="text-[10px]">About</span>
          </button>
        </div>
        <div className="text-center pt-2 border-t border-slate-100 mt-2">
          <p className="text-[10px] text-slate-400">Vigil by <a href="https://www.stayd.uk" target="_blank" rel="noopener noreferrer" className="font-medium hover:text-emerald-600">stayd</a> &middot; Not legal advice</p>
        </div>
      </nav>

      {/* Overlays */}
      <UpdateModal />
      {toast && <Toast message={toast} onClose={() => setToast(null)} />}
    </div>
  )
}

export default App
