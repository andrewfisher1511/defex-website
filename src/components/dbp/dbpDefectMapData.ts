export interface DbpDefect {
  n: number;
  left: string;
  top: string;
  name: string;
  where: string;
  reg: string;
  cause: string;
  risk: string;
  fix: string;
}

/**
 * Verbatim from design_files/DEFEX DBP Hub.dc.html's `defects` array.
 * Ported in full for <DefectMap/> — not rendered by default (showDefectMap
 * is false); only the "IN DEVELOPMENT" placecard shows until real defect
 * photography lands.
 */
export const DBP_DEFECTS: DbpDefect[] = [
  {
    n: 1,
    left: "82.7%",
    top: "68%",
    name: "Spalling concrete",
    where: "BALCONY EDGES, SOFFITS, SLAB CORNERS",
    reg: "Structural — regulated design usually required",
    cause:
      "Water reaches the steel reinforcement inside the concrete. The steel rusts, expands to several times its size, and pops the concrete off from the inside — which is why it’s nicknamed \"concrete cancer\".",
    risk: "Falling concrete is a safety hazard, and the damage compounds: every year untreated roughly multiplies the repair area. Eventually it threatens the slab itself.",
    fix: "Investigate the true extent (it’s always more than what’s visible), design a compliant structural repair, and oversee the rectification so it doesn’t come back.",
  },
  {
    n: 2,
    left: "72.1%",
    top: "38%",
    name: "Failed balcony membrane",
    where: "BALCONY FLOOR, UNDER TILES",
    reg: "Waterproofing — regulated design required",
    cause:
      "Membranes have a service life — often 15–25 years — and many were poorly detailed at edges, drains and door thresholds to begin with.",
    risk: "Water tracks into the unit below and into the slab: stained ceilings, ruined flooring, then spalling and magnesite damage. One failed balcony often signals the whole building is due.",
    fix: "Moisture testing, falls assessment, and a remedial waterproofing design to AS 4654 — declared and lodged as the Act requires.",
  },
  {
    n: 3,
    left: "84.2%",
    top: "28.9%",
    name: "Non-compliant balustrade",
    where: "BALCONY AND STAIR EDGES",
    reg: "Safety/egress — regulated design usually required",
    cause:
      "Built to older rules — too low, gaps too wide, climbable rails — or the fixings have corroded where they enter the concrete.",
    risk: "Fall from height. This is the defect with the most serious consequences and the clearest liability for an owners corporation that knew and didn’t act.",
    fix: "Compliance check against the current NCC, load testing where warranted, and design of a compliant replacement or upgrade.",
  },
  {
    n: 4,
    left: "34.6%",
    top: "46.1%",
    name: "Failed cavity flashing",
    where: "INSIDE WALLS, ABOVE WINDOWS AND SLAB EDGES",
    reg: "Often triggers waterproofing/structural design",
    cause:
      "The hidden metal or membrane flashings that catch water inside the wall cavity were omitted, installed wrongly, or have perished with age.",
    risk: "Water tracks invisibly inside the wall — damp patches, mould, corroding lintels and wall ties. Because it’s hidden, it’s usually found late.",
    fix: "Targeted investigation openings to confirm the failure, then flashing replacement details the builder can actually price and build.",
  },
  {
    n: 5,
    left: "30.8%",
    top: "64.8%",
    name: "Magnesite damage",
    where: "FLOOR TOPPING INSIDE UNITS (1960s–80s BUILDINGS)",
    reg: "Structural — regulated design usually required",
    cause: "Magnesite was a popular floor levelling topping. It absorbs moisture and becomes corrosive to the reinforcement in the slab beneath it.",
    risk: "Concrete cancer developing under the flooring where nobody can see it — often discovered only during a renovation, by which time the slab needs real repair.",
    fix: "Testing to confirm magnesite and assess the slab, then a removal and repair scope — commonly bundled building-wide for cost efficiency.",
  },
  {
    n: 6,
    left: "63.5%",
    top: "36.7%",
    name: "No overflow provision",
    where: "BALCONY UPSTANDS AND DOOR THRESHOLDS",
    reg: "Waterproofing/drainage — regulated design usually required",
    cause: "Many balconies were built with a single floor waste and no overflow. One blocked drain in a storm and the balcony becomes a bathtub.",
    risk: "Water over the door threshold and into the unit — carpet, timber floors, walls. Insurance claims often follow, and insurers ask why there was no overflow.",
    fix: "Overflow and drainage design as part of any balcony remediation, so the balcony fails safe instead of flooding inward.",
  },
  {
    n: 7,
    left: "71.2%",
    top: "69.5%",
    name: "Inadequate drainage falls",
    where: "BALCONY AND PODIUM SURFACES",
    reg: "Waterproofing — regulated design usually required",
    cause: "The surface was never sloped properly to the drain — or repairs and re-tiling over the years have flattened the falls.",
    risk: "Ponding water accelerates membrane failure, feeds efflorescence and drummy tiles, and makes every other balcony defect worse.",
    fix: "Falls-to-drain survey (measured, not eyeballed), then screed and drainage redesign to AS 4654 as part of the remediation package.",
  },
  {
    n: 8,
    left: "23.1%",
    top: "81.3%",
    name: "Cracking brickwork",
    where: "FACADE WALLS, TYPICALLY LOWER LEVELS AND OPENINGS",
    reg: "Structural — assessment first, design if repairs are structural",
    cause: "Ground movement, corroding steel lintels above windows, failed wall ties, or the building simply settling — each has a distinct crack pattern.",
    risk: "Depends entirely on the cause: some cracks are cosmetic, others are the facade telling you something structural. Guessing wrong in either direction is expensive.",
    fix: "Structural assessment to diagnose the cause, crack monitoring where warranted, and repair detailing matched to the actual mechanism — not just filler.",
  },
];
