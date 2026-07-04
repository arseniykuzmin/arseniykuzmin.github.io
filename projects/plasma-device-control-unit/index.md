---
hero: /projects/plasma-device-control-unit/controlunit-render.jpg
hero_caption: CAD layout of the aluminum-framed unit — a Raspberry Pi with a stacked HAT, DAC boards, and a front panel of feedthroughs, thermocouple ports, and mains inlet.
layout: split
gallery:
  - src: /projects/plasma-device-control-unit/controlunit-spaghetti.jpg
    caption: 2019 — a bare Raspberry Pi and HAT in a food container, wired straight into the plasma bench.
  - src: /projects/plasma-device-control-unit/controlunit-prototype.jpg
    caption: 2020 — the breadboard prototype beside its CAD render and the first aluminum-extrusion enclosure.
  - src: /projects/plasma-device-control-unit/controlunit-pcb.jpg
    caption: 2025 — the custom aklab Pi-Hat Breakout (rev 1) PCB, retiring the hand-soldered perfboards for a proper board.
  - src: /projects/plasma-device-control-unit/controlunit-panel-2026.jpg
    caption: 2026 — cleaning up the plug interfaces — the scratched, hand-labeled panel (bottom) gives way to keyed connectors, labeled BNCs, and an RJ45 for LAN (top).
  - src: /projects/plasma-device-control-unit/controlunit-heater.jpg
    caption: A sibling 3D-printed module — the probe-heater box — small, self-contained, and slide-in, the way the design is heading.
  - src: /projects/plasma-device-control-unit/controlunit-tclogger.jpg
    caption: The new direction in the flesh — a networked ESP32 thermocouple logger, 3D-printed, with an OLED readout and phone access over Wi-Fi.
---

An open-source control and data-acquisition unit for my plasma irradiation and
hydrogen transport experiments (PIHTI). It runs on a Raspberry Pi with a
Python/PyQt interface — logging vacuum and plasma parameters, driving the gas
flows, and closing the loop on plasma current — while staying cheap, hackable,
and fully documented.

Code on [GitHub](https://github.com/queezz/ControlUnit) ·
[Documentation](https://queezz.github.io/ControlUnit/)

<!--more-->

## What it does

- Orchestrates a plasma run end to end — logging chamber pressures and
  plasma/probe currents through onboard ADC boards over long, steady-state
  operations.
- Drives the process-gas mass-flow controllers and closes a feedback loop on
  the plasma current.
- Emits sync signals and a front-panel LED to time-align external instruments
  such as the QMS.
- Built on a Raspberry Pi with custom PiHat breakout PCBs, Hall current
  sensors, a proper power supply, and deliberate grounding and EMI proofing.
- Python software — open-source and documented.

## From spaghetti to an instrument

The unit grew up over six years. It began as a bare Raspberry Pi and a HAT
living in a plastic food box, wired straight into the experiment. That prototype
earned a proper home — an aluminum-extrusion enclosure drawn in CAD, then built,
with the boards, breadboard, and feedthroughs laid out behind a real front
panel. The current generation adds a proper MeanWell PSU, custom breakout PCBs,
and genuine attention to grounding and signal routing: the difference between
"works on the bench" and an instrument you can trust.

## Where it's going

The next step trades the single box for **small, self-contained modules** —
3D-printed slide-in cases that drop into a rack, each an ESP32 (or Raspberry Pi)
that talks over **LAN**. Let the network carry the distance, and keep the fast,
noisy SPI/I²C buses local to each module, so a sensor's analog front end never
has to cross the lab.

It's a deliberate bet against the National Instruments / LabVIEW way: something
more flexible, far cheaper, and — honestly — more charming. If there is ever
time to finish it. But someone will.
