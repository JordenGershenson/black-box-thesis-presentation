# Thesis Defense: Opening the Black Box

**Speaker:** Jorden Gershenson
**Date:** December 1, 2025
**Committee:** Dr. Xin Zhong (Chair), Dr. Hesham Ali, Dr. Adam Houston, Dr. Pei-Chi Huang

---

## Section 1: Introduction & Context (Slides 1-4)

### Slide 1: Title (01-title.html)
**Title:** Opening the Black Box: Attention Analysis Reveals Learned Physics and Architectural Constraints in Transformer Weather Models

**Speaking Notes:**
- Welcome committee and audience
- This thesis explores how we can understand what ML weather models have learned
- Bridge between cutting-edge AI and operational meteorology

---

### Slide 2: Overview (02-overview.html)
**Purpose:** Roadmap for the presentation

**Speaking Notes:**
- Six sections: Background → Problem → Method → Results → Validation → Conclusions
- ~25 minutes presentation + questions
- Signal this is a framework contribution, not just an empirical study

---

### Slide 3: Background - Numerical Weather Prediction (03-background-nwp.html)
**Key Points:**
- NWP pipeline: Observations → Data Assimilation → Initial Conditions → Model → Forecast
- Scale: 721×1440 grid at 0.25° resolution, 37 pressure levels
- Cost: ~1 hour runtime on 10K+ CPU cores
- Stakeholders: Aviation, emergency services, energy, agriculture, defense, shipping

**Speaking Notes:**
- Emphasize that NWP provides *explicit physical reasoning* forecasters can interrogate
- This interpretability is what we're trying to achieve for ML models
- Mention ECMWF, NOAA, Met Office as major operational centers

---

### Slide 4: The Paradigm Shift — And Its Cost (04-paradigm-shift.html)
**Key Points:**
- NWP: ~1 hour, 10K+ CPUs, explicit physics, traceable reasoning, 60+ years of trust
- MLWP: ~1 minute, 1 GPU, matches/exceeds accuracy, but BLACK BOX

**The Trust Problem:**
- When ML predicts hurricane rapid intensification but NWP disagrees, how does a forecaster decide with 6 hours to warning?
- This is the core motivation for explainability

**Speaking Notes:**
- This slide sets up the central tension of the thesis
- Speed and accuracy are solved problems; trust is not
- Cite Bi et al. (2023) for Pangu-Weather, Lam et al. (2023) for GraphCast

---

## Section 2: Background & Problem Definition (Slides 5-8)

### Slide 5: Background - Explainable AI (05-background-xai.html)
**Key Points:**
- Without explainability: Can't debug failures, unknown biases, regulatory concerns
- With explainability: Understand reasoning, identify limitations, build appropriate trust
- Quote: "Trust, but verify" — applies to ML systems

**Speaking Notes:**
- Connect to McGovern et al. (2019) on importance of understanding physical implications
- XAI is especially critical for extreme events where models often underperform

---

### Slide 6: Background - The Transformer Architecture (06-background-transformer.html)
**Key Points:**
- Core idea: Self-Attention — every position can attend to every other position
- Attention weights tell us "where the model is looking"
- Foundation: Vaswani et al. (2017)

**Speaking Notes:**
- Keep this accessible — not everyone knows Transformers
- Emphasize that attention is inherently interpretable (unlike hidden layers)
- This is why attention-based explanation is promising

---

### Slide 7: The Challenge - Swin Transformer Architecture (07-challenge-swin.html)
**Key Points:**
- Standard Transformer: Global attention, O(N²) complexity — intractable for weather
- Swin Transformer: Local windows with shifting — tractable but complex
- Problem: Standard XAI tools don't handle shifted windows or 3D hierarchical structure

**Speaking Notes:**
- Pangu-Weather uses Swin backbone (Liu et al., 2021)
- This is the technical challenge that required algorithm adaptation
- Most XAI work is on classification ViTs (Chefer et al., 2021), not 3D weather

---

### Slide 8: Research Objectives (08-research-objectives.html)
**Three Objectives:**
1. **Visualization:** Create intuitive tools for meteorologists
2. **Validation:** Assess if explanations align with meteorological intuition
3. **Methodology:** Adapt attention rollout for hierarchical 3D windowed architectures

**Thesis Framing:** This is a *framework contribution* — demonstrating feasibility and path forward

**Speaking Notes:**
- Emphasize this is about demonstrating the approach works, not comprehensive climatology
- The algorithm now exists and can be scaled

---

## Section 3: Methodology (Slides 9-13)

### Slide 9: The Approach - Attention as Information Routing (09-approach-attention.html)
**The Debate:**
- Skeptics: "Attention is not Explanation" (Jain & Wallace, 2019)
- Proponents: "Attention is not *not* Explanation" (Wiegreffe & Pinter, 2019)

**Our Stance:** Attention maps the model's "field of view" — useful for understanding information routing even if not strictly causal

**Speaking Notes:**
- Acknowledge the limitations upfront — builds credibility
- We're not claiming attention = causation
- We're claiming it reveals what the model considers relevant

---

### Slide 10: Experimental Design (10-experimental-design.html)
**Pipeline (8 steps):**
1. Select Model (Pangu-Weather)
2. Download & Test locally
3. Instrument (hook attention layers)
4. Run Forecast (24h prediction)
5. Collect attention matrices
6. Select 12 focal points across climate regimes
7. Run reverse rollout algorithm
8. Visualize (wind-roses) and Analyze (statistics)

**Key Parameters:**
- 721×1440 grid (0.25°), 14 pressure levels
- 12 focal points: 4 Tropical, 3 Trade Wind, 3 Subtropical, 2 Mid-Latitude
- Variables: Temperature, Geopotential, U-wind, V-wind

**Speaking Notes:**
- Single forecast (July 2-3, 2019) — proof of concept scope
- pangu-pytorch implementation for reproducibility

---

### Slide 11: Algorithm - Reverse Attention Rollout (11-algorithm-reverse-rollout.html)
**Core Intuition:** Start from output pixel, trace backward through attention layers to find which inputs contributed

**Algorithm:**
1. Initialize mass=1.0 at target output
2. Propagate backward: mass[layer] = Aᵀ @ mass[layer+1]
3. Handle Swin-specific: window unshifting, hierarchical upsampling
4. Result: contribution map at input (sums to 1.0)

**Key Property:** Mass-preserving — enables probabilistic interpretation

**Speaking Notes:**
- Based on Abnar & Zuidema (2020), extended for Swin
- The transpose (Aᵀ) is key — reverses flow direction
- Mass preservation means we can say "X% of influence came from region R"

---

### Slide 12: Visualization - Global Contribution Maps (12-viz-contribution-maps.html)
**Purpose:** Show spatial distribution of attention across pressure levels

**Speaking Notes:**
- These maps show where the model "looks" to make a prediction
- Color scale: yellow = high attention, purple = low
- Can see synoptic-scale focus and zonal elongation

---

### Slide 13: Visualization - Wind-Rose Diagrams (13-viz-wind-rose.html)
**Two Normalization Approaches:**
- **Ring-Normalized:** Shows directional preference within each distance band
- **Global-Normalized (★):** Shows both direction AND distance decay together

**Speaking Notes:**
- Dr. Houston preferred global-normalized — "more intuitive"
- These aggregate the 3D contribution maps into interpretable 2D summaries
- Can see E-W elongation clearly

---

## Section 4: Results (Slides 14-17)

### Slide 14: Result - Synoptic-Scale Focus (14-result-synoptic-scale.html)
**Key Metrics:**
- R50 = 1,624 km (radius containing 50% of contribution)
- R80 = 2,598 km
- R95 = 3,747 km

**Physical Interpretation:**
- Jet stream speeds (~50 m/s) cover ~4,300 km in 24 hours
- R80 ≈ 2,600 km aligns with this advection scale
- **LEARNED PATTERN:** Model tuned receptive field to forecast horizon

**Speaking Notes:**
- Remarkably uniform: CV = 4% across all 12 focal points
- Near-field (<1000 km): 24.3% of attention
- Far-field (>5000 km): only 0.83%

---

### Slide 15: Result - Universal Zonal Anisotropy (15-result-zonal-anisotropy.html)
**Finding:** Universal East-West elongation
- Aspect Ratio ≈ 1.25 (25% wider than tall)
- E-W extent ~20% larger than N-S

**Interpretation:**
- Model inputs are geometric grids (no directional bias)
- Yet attention is anisotropic → **LEARNED from data**
- Consistent with Coriolis-driven zonal flow in atmospheric dynamics

**Speaking Notes:**
- This is the STRONGEST evidence of learned physics
- The model discovered atmospheric dynamics from data alone
- Cite Holton (2004) for geophysical fluid dynamics context

---

### Slide 16: Observation - Symmetric Bidirectional Attention (16-observation-symmetric.html)
**Finding:** Westward Bias Index ≈ 0.5 (perfectly symmetric)

**The Anomaly:**
- Physical advection is directional (upstream → downstream)
- Model shows NO upstream preference

**Hypothesis:** This is an **ARCHITECTURAL SIGNATURE**
- Bidirectional Transformer sees full spatial context
- Learns symmetric correlations, not causal propagation

**Speaking Notes:**
- This might be a limitation for forecasting directional phenomena
- Future work: compare to causal/masked architectures

---

### Slide 17: Observation - Latitudinal Uniformity (17-observation-latitudinal.html)
**Finding:** Attention scale remarkably uniform across latitudes (CV = 4%)

**The Anomaly:**
- In NWP, error covariances vary significantly by latitude (Gaspari & Cohn, 1999)
- Tropical vs. mid-latitude dynamics are fundamentally different

**Inference:** Fixed Swin window size imposes rigid "field of view"
- **ARCHITECTURAL CONSTRAINT** limiting regime-specific adaptation

**Speaking Notes:**
- This suggests potential model improvement: adaptive window sizes
- The uniformity is suspiciously perfect — likely architectural not physical

---

## Section 5: Validation & Synthesis (Slides 18-19)

### Slide 18: Expert Evaluation - Dr. Adam Houston (18-expert-evaluation.html)
**Expert:** Associate Professor of Meteorology, UNL; 20+ years severe weather experience

**Key Responses:**
- Visualization design: 4/5 — "global-normalized more intuitive"
- Physical patterns: "E-W elongation makes sense — reflects Coriolis-driven zonal flow"
- Trust impact: +1 — "Would I consult this for unexpected forecast? Definitely."

**Critical Feedback:**
- Wants accuracy metrics alongside explanations
- Questions whether model understands fluid dynamics or just correlations

**Speaking Notes:**
- N=1 limitation acknowledged — future work needs broader panel
- Key insight: XAI's primary value is model validation and trust-building
- Not real-time operational tool, but diagnostic for understanding model behavior

---

### Slide 19: Synthesis - Learned Physics vs. Architectural Artifacts (19-synthesis.html)
**Summary Table:**
| Pattern | Source | Implication |
|---------|--------|-------------|
| Synoptic-scale focus | ✓ Learned | Appropriate scale for 24h forecasts |
| Zonal anisotropy | ✓ Learned | Consistent with atmospheric dynamics |
| Symmetric attention | ⚠ Artifact | May miss directional propagation |
| Scale uniformity | ⚠ Artifact | Limited regime-specific adaptation |

**Key Takeaway:** Attention analysis serves dual purposes:
1. Validating that models learn physically meaningful patterns
2. Revealing architectural limitations that constrain expressiveness

**Speaking Notes:**
- Both insights are essential for building trust
- We can now have informed conversations about model design tradeoffs

---

## Section 6: Conclusions (Slides 20-24)

### Slide 20: Limitations (20-limitations.html)
**Honest Limitations:**
1. Single 24-hour forecast case study — may not generalize
2. Single attention head per layer — different heads may specialize
3. Algorithm parameters not optimized — sensitivity analysis needed
4. N=1 expert evaluation — needs broader panel
5. No comparison to gradient-based attribution (SHAP, integrated gradients)

**Framing:** These are thesis-scope limitations. The contribution is demonstrating *feasibility*.

**Speaking Notes:**
- Acknowledging limitations builds credibility
- Each limitation maps to future work opportunity

---

### Slide 21: Future Work (21-future-work.html)
**Four Directions:**
1. **Climatological Scaling:** Hundreds of forecasts across seasons and regimes
2. **Multi-Head Analysis:** Do different heads specialize?
3. **Comparative XAI:** Compare Pangu (Swin) vs. GraphCast (GNN) vs. FourCastNet (FNO)
4. **Operational Integration:** Real-time explanation generation

**Highest Impact:** Analyze attention during forecast "busts" (e.g., hurricane rapid intensification)

**Speaking Notes:**
- Cite Zhang et al. (2025) on MLWP underperformance at extremes
- Understanding failure modes is where XAI adds most value

---

### Slide 22: Summary of Contributions (22-contributions.html)
**Four Contributions:**
1. **Algorithm:** Mass-preserving reverse rollout for 3D hierarchical Transformers
2. **Visualization:** Meteorologist-interpretable attention maps and wind-roses
3. **Validation:** Expert evaluation demonstrating physical plausibility
4. **Insight:** Evidence of learned physics AND architectural constraints

**Central Claim:** Accuracy is important, but so is explainability. We should consider interpretability when designing and deploying ML weather models — and this thesis shows it's achievable.

**Speaking Notes:**
- This is the "so what" slide — make the contributions crystal clear
- Emphasize this is a framework that can be built upon

---

### Slide 23: Conclusions & Questions (23-conclusions.html)
**Summary:**
- Framework for explaining attention-based weather predictions
- Validated through expert meteorological evaluation
- Key finding: Model learned physically meaningful patterns (zonal flow, synoptic scales) while revealing architectural constraints

**Contact:** jordengg@gmail.com | Code: bit.ly/pangu-xai

**Speaking Notes:**
- Thank committee and audience
- "Moving from Black Boxes to Glass Boxes"
- Open floor for questions

---

### Slide 24: Appendix - Statistical Summary (24-appendix-statistics.html)
**Purpose:** Backup slide with detailed metrics for all 12 focal points

**Speaking Notes:**
- Only show if asked about specific numbers
- Contains R50/R80/R95, aspect ratios, directional indices for each location

---

## Quick Reference: Key Citations

- **Bauer et al. (2015):** "Quiet revolution" in NWP
- **Bi et al. (2023):** Pangu-Weather
- **Lam et al. (2023):** GraphCast
- **Liu et al. (2021):** Swin Transformer
- **Vaswani et al. (2017):** Original Transformer
- **Abnar & Zuidema (2020):** Attention Rollout
- **Jain & Wallace (2019):** "Attention is not Explanation"
- **Wiegreffe & Pinter (2019):** "Attention is not *not* Explanation"
- **McGovern et al. (2019):** XAI for meteorology
- **Zhang et al. (2025):** MLWP extreme event limitations
- **Holton (2004):** Atmospheric dynamics
- **Gaspari & Cohn (1999):** Error covariances
- **Hersbach et al. (2020):** ERA5 Reanalysis
