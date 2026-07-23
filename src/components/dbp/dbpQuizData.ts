export interface DbpQuestion {
  q: string;
  opts: [string, string, string];
  correct: 0 | 1 | 2;
  explain: string;
  assist: string;
}

export interface DbpScoreBand {
  min: number;
  title: string;
  blurb: string;
}

/**
 * Verbatim from design_files/DEFEX DBP Hub.dc.html's `questions` array —
 * do not edit copy here without checking against that source.
 *
 * Two exceptions, both deliberate: the assist strings for questions 2 and 8
 * used an em dash in the source file, which conflicts with the README's
 * "no em dashes in quiz copy" rule. Reworded to keep the em dash out while
 * preserving meaning exactly; everything else is verbatim, including the
 * curly apostrophes.
 */
export const DBP_QUESTIONS: DbpQuestion[] = [
  {
    q: "Your building is a three-storey strata block of nine units. Does the DBP Act apply to it?",
    opts: [
      "No, it only covers new high-rise towers",
      "Yes, it covers class 2 (strata apartment) buildings, old and new",
      "Only if the building was built after 2020",
    ],
    correct: 1,
    explain:
      "The Act covers class 2 buildings: apartment buildings where people live above, below or beside each other, regardless of age. If your property is a strata plan, assume it applies.",
    assist:
      "DEFEX works exclusively on class 2 remedial projects. We can confirm exactly how the Act applies to your building before you commit to anything.",
  },
  {
    q: 'The balcony waterproofing membrane has failed and needs replacing. Does that need a "regulated design"?',
    opts: [
      "No, it’s just maintenance",
      "Only if the balcony is being made bigger",
      "Yes. Waterproofing is a regulated building element, repairs included",
    ],
    correct: 2,
    explain:
      "Waterproofing is one of the regulated building elements. Repairing or replacing it generally triggers the Act: a registered design practitioner prepares and declares the design before work starts.",
    assist:
      "We prepare and declare regulated waterproofing designs (membranes, falls, overflows) as registered practitioners.",
  },
  {
    q: "Who is allowed to prepare a regulated design?",
    opts: [
      "Any experienced builder",
      "A registered design practitioner (registered with NSW Fair Trading)",
      "The strata manager, if the committee approves it",
    ],
    correct: 1,
    explain:
      "Only a registered design practitioner can prepare and declare a regulated design. You can check anyone’s registration in two minutes at verify.licence.nsw.gov.au.",
    assist:
      "Andrew is a NSW Registered Design Practitioner and Professional Engineer. Both registrations are linked and verifiable on our site footer.",
  },
  {
    q: "The committee wants to repaint the lobby and patch some hairline render cracks. Regulated design needed?",
    opts: [
      "Generally no, minor cosmetic work is usually exempt",
      "Yes, all building work now needs one",
      "Only if the building is over three storeys",
    ],
    correct: 0,
    explain:
      'Genuinely minor cosmetic work (repainting, minor render patching, re-pointing) generally doesn’t trigger the Act, provided it isn’t structural, doesn’t involve waterproofing and doesn’t touch a non-compliant element. But "minor" is narrower than most people think.',
    assist:
      "Unsure whether a job is exempt? We give committees a quick written call on what triggers the Act before quotes are sought.",
  },
  {
    q: "Water is pouring through a ceiling from the balcony above, right now. Can repairs start without a regulated design?",
    opts: [
      "No. You must always wait for the paperwork",
      "Yes, anything goes in an emergency",
      "Possibly. A narrow emergency exemption covers immediate work to stop serious damage, with the proper repair designed afterwards",
    ],
    correct: 2,
    explain:
      "There is an emergency exemption but it’s deliberately narrow: immediate action, serious damage, and works limited to stopping the harm. The permanent repair still needs the full process, and even emergency work carries paperwork.",
    assist:
      "We take same-day emergency calls, scope what’s genuinely exempt, and design the permanent repair so your committee stays covered.",
  },
  {
    q: 'What is a "design compliance declaration"?',
    opts: [
      "A builder’s promise that the job will be tidy",
      "A formal declaration by the registered practitioner that the design complies with the Building Code, lodged on the NSW Planning Portal",
      "An insurance certificate for the owners corporation",
    ],
    correct: 1,
    explain:
      "It’s the registered practitioner formally putting their name to the design: declaring it complies with the BCA/NCC and relevant Australian Standards, lodged on the NSW Planning Portal before construction.",
    assist:
      "Every DEFEX regulated design ships with its compliance declaration lodged correctly. That is the paperwork protecting your committee.",
  },
  {
    q: "Your building needs balcony concrete repairs this year, membrane replacement next year, and balustrade upgrades the year after. What’s usually the smarter approach?",
    opts: [
      "Do each job separately as money allows",
      "Bundle them into one coordinated project with one approval",
      "Wait until all three become emergencies",
    ],
    correct: 1,
    explain:
      "These elements are physically interconnected: repairing one disturbs the others. Bundling them means one planning approval, one set of designs, one scaffold hire, and residents disrupted once instead of three times.",
    assist:
      "Our specialty: assessing everything your building needs over the next few years and packaging it into one coordinated, costed remedial program.",
  },
  {
    q: "The cheapest quote is from a builder who isn’t registered under the DBP Act. What’s the real risk of using them?",
    opts: [
      "None, if the price is good and they seem experienced",
      "Just a slap on the wrist if caught",
      "Fines, personal liability, project delays, and potential problems with insurance and fire safety statements",
    ],
    correct: 2,
    explain:
      "Engaging unregistered practitioners can mean fines and legal exposure for the owners corporation, stalled projects, and flow-on problems with building insurance and annual fire safety statements. The cheap quote is rarely cheap.",
    assist:
      "We help committees vet builders’ registrations and write scopes that make compliance a condition of the contract, before anyone signs.",
  },
];

/** Verbatim from the design file's `bands` array. */
export const DBP_SCORE_BANDS: DbpScoreBand[] = [
  {
    min: 0,
    title: "Time for a crash course",
    blurb:
      "No shame. Most committees are in the same spot, and the Act is genuinely dense. The guide above covers everything you missed, and the checklist below is your starting point. Ten minutes of reading now can save your building tens of thousands later.",
  },
  {
    min: 4,
    title: "Solid foundations",
    blurb:
      "You know more than most committee members. The gaps you do have are the expensive kind: they tend to surface mid-project, after contracts are signed. Worth closing them before your next repair lands on the agenda.",
  },
  {
    min: 7,
    title: "Committee ready",
    blurb:
      "Impressive. You clearly pay attention. You’re exactly the person who should be asking the sharp questions at the next AGM. Keep the checklist handy for the rest of the committee.",
  },
];

export function scoreBandFor(finalScore: number): DbpScoreBand {
  const matches = DBP_SCORE_BANDS.filter((band) => finalScore >= band.min);
  return matches[matches.length - 1] ?? DBP_SCORE_BANDS[0];
}
