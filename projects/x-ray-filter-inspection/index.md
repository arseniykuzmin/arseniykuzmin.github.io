---
subtitle: MCNP simulation and patented filter design for radioisotope inspection of annular welded joints.
hero_caption: >
  Concept of the perforated radiographic filter disk. The hexagonal channels
  shape the radiation field reaching the detector.
gallery:
  - src: /projects/x-ray-filter-inspection/mcnp-simulation-layout.png
    caption: >
      MCNP geometry used to test the inspection concept: source, fuel pipe,
      weld, flange, defect, filter, and detector.
  - src: /projects/x-ray-filter-inspection/mcnp-simulation-of-defect-detecton.png
    caption: >
      Synthetic radiographic image from the MCNP model. The artificial defect
      appears as a local intensity disturbance and is also visible in the
      profile.
---
This project came from a very applied corner of nuclear engineering: how do you see a tiny defect in a welded joint when the object itself is a compact radiation-scattering machine?

In fission-reactor fuel assemblies and related tube structures, welded joints are not decorative details. Their quality matters, but cutting the part open defeats the point, so the inspection has to be non-destructive. Radioisotope radiography is a natural route: place a gamma source inside the structure and record the transmitted radiation outside.

The difficulty is the geometry. Source holder, pipe, flange, weld, detector, and surrounding hardware all sit very close to each other. The useful signal carries information about the weld, but the same compact metal geometry also produces scattered radiation, which lowers contrast and makes small defects harder to see.

My part was the modelling side. I built an MCNP mock-up of the inspection setup: gamma source, fuel pipe, annular weld, flange, detector, and a candidate filter between the object and the detector. The simulation was not meant to make a pretty picture. It was meant to answer a practical question: if a small defect is present near the weld, does it leave a measurable signature in the detector intensity?

The filter itself is a deliberately strange object: a thin radiation-opaque disk perforated by a regular pattern of hexagonal channels. During exposure the disk rotates or oscillates, so the detector does not simply see the hole pattern. It sees a time-averaged filtered radiation field. The aim is simple: keep more of the useful directional information and suppress part of the scattered background.

The MCNP result was encouraging. In the synthetic image, the defect appears as a local perturbation in the intensity field, and the line profile shows it clearly. In the old presentation we wrote the result in the most direct engineering language: with the new filter, defects smaller than 0.1 mm could be detected in the model.

The work later became part of Russian patent [RU2530452C1](https://patents.google.com/patent/RU2530452C1/en?oq=RU2530452C1), Method and apparatus for radioisotope flaw detection of annular weld joints. It is one of those projects where the useful output was not a paper, but a device concept, a simulation argument, and a small patented piece of nuclear-engineering hardware.
