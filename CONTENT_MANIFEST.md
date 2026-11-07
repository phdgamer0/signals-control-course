# Content Manifest — source traceability & completion checklist

This file records the actual contents of every lecture PDF in `saysal-denetim/` and where each item lives on the website.
It was built from a page-by-page visual transcription of the handwritten scans (no text layer exists), then filled in by the lesson authors as each item was incorporated. An item is marked ✅ only once it is actually present on the website.

**Source files** (8 PDFs, 80 handwritten pages). The folder originally also contained `05-Elektriksel-Sistemlerin-Modellenmesi.pdf`; it was a duplicate of the 05 lecture and was removed by the student, so Module 05 is built from `05 Elektriksel Sistemlerin Modellenmesi.pdf` alone.

## Summary

| Module | PDF | Pages | Manifest items | ✅ | Professor's examples | Additional examples | Exercises | Formula-reference entries |
|---|---|---|---|---|---|---|---|---|
| 01 | 01 Giriş ve Temel Kavramlar.pdf | 9 | 43 | 43 | 4 | 8 | 19 | 11 |
| 02 | 02 Giriş-Çıkış-Kararlılık.pdf | 10 | 43 | 43 | 5 | 13 | 20 | 16 |
| 03 | 03 Laplace Dönüşümü.pdf | 15 | 42 | 42 | 8 | 14 | 23 | 21 |
| 04 | 04-Blok-Şemalar-ve-Akış-Şemaları.pdf | 4 | 25 | 25 | 2 | 7 | 17 | 16 |
| 05 | 05 Elektriksel Sistemlerin Modellenmesi.pdf | 6 | 30 | 30 | 3 | 7 | 18 | 17 |
| 06 | 06 Birinci Derece Sistemlerim Zaman Tepkesi.pdf | 9 | 37 | 37 | 7 | 8 | 17 | 14 |
| 07 | 07 İkinci Derece Sistemlerim Zaman Tepkesi.pdf | 17 | 47 | 47 | 2 | 6 | 23 | 17 |
| 08 | 08 Baskın Kutuplar ve Matematiksel Tanımlar.pdf | 10 | 36 | 36 | 3 | 7 | 17 | 14 |
| **Total** | | **80** | **303** | **303** | **34** | **70** | **154** | **126** |

("Professor's examples" counts worked-example boxes sourced from the notes; Module 06 splits its two examples into several boxes.)

## Corrections to the handwritten notes (all flagged on the website)

| Lecture / page | What the notes say | Correct | Where |
|---|---|---|---|
| 02 p10, 03 p2 | δ(0) = 1 | δ is an infinitely tall pulse of area 1; L{δ}=1 still holds (lower limit 0⁻) | 02, 03 |
| 02 p5 | e_ss = 1 − (ess) | e_ss = 1 − y_ss | 02 |
| 03 p11 | repeated root at s = p, limit s→p | s = −p | 03 |
| 03 p13 | roots α ± jω | −α ± jω | 03 |
| 03 p14 | f(t) = (1/√2)cos(t−45°) − ½e^{−2t} | (1/√2)e^{−t}cos(t−45°) − ½e^{−2t} | 03 |
| 04 p1 / p2 / p3 | "(R−X,X)", "1+G₁G₂H", block "R₂" | (R−H₁X), 1+G₁G₂H₁, G₂ | 04 |
| 06 p2 | slope (1/τ²)e^{−t/τ} (intermediate) | −(1/τ²)e^{−t/τ} | 06 |
| 06 p6 | y(∞) = lim_{s→∞} … | s→0 | 06 |
| 06 p9 | IVT applied without the impulse term | split off the constant term first | 06 |
| 07 p5 | s₁,₂ = ω_n | −ω_n | 07 |
| 07 p13, p17 | underdamped ramp phase θ (66.42°), 0.174 | 2θ (132.84°), 0.1746 | 07 |
| 07 p10 | step sketches with non-zero initial slope | all step responses start with zero slope | 07 |
| 08 p1–2 | "zaman sabiti düşük" for poles near 0; e^{10t} | "yüksek"; e^{−10t} | 08 |
| 08 p3 | y(t) = 1 − 0.6e^{−3t}sin4t − … | coefficient 0.75 | 08 |
| 08 p7 / p8 | e^{αt_p}; y(t_p) = 1 − … | e^{−αt_p}; 1 + … | 08 |

## Per-module checklists

## Module 01 — 01 Giriş ve Temel Kavramlar.pdf

| Page | Item | Type | Website location | Status |
|---|---|---|---|---|
| 1 | Heading "Giriş" (Introduction) | topic | § What is a control system? | ✅ explained |
| 1 | Fig: Giriş → [Kontrol sistemi] → Çıkış | diagram | § What is a control system? (SimpleSystemBD) | ✅ reconstructed |
| 1 | Function of a control system (desired output for applied input; voltage, force, light) | definition | § What is a control system? → Def "Control system" | ✅ explained |
| 1 | Control systems can be classified by different parameters | remark | § What is a control system? (end) | ✅ explained |
| 2 | Continuous-time vs discrete-time (by signal type) | definition | § Classifying control systems → Continuous-time vs discrete-time | ✅ explained |
| 2 | SISO vs MIMO (by number of I/O ports) | definition | § Classifying control systems → SISO vs MIMO | ✅ explained |
| 2 | Open loop vs closed loop (by use of feedback) | definition | § Classifying control systems → Open-loop vs closed-loop | ✅ explained |
| 2 | Course scope: continuous-time SISO first | remark | § Classifying control systems → Note "Scope of the course" | ✅ explained |
| 3 | Definition of open-loop system | definition | § Open-loop systems → Def | ✅ explained |
| 3 | Fig: Giriş → [Kontrolcü] →(Uygulama sinyali)→ [Sistem] → Çıkış | diagram | § Open-loop systems (OpenLoopBD) | ✅ reconstructed |
| 3 | No measurement/improvement at output; human control | remark | § Open-loop systems + Intuition box | ✅ explained |
| 3 | Examples: washing machine, fan cooler, drivetrain, electric cutter | example (prof) | § Open-loop systems "Examples from the notes"; Exercise "Open or closed loop" | ✅ explained |
| 3 | Open loop widely used under human control | remark | § Open-loop systems (end) | ✅ explained |
| 3–4 | Autonomous systems need output measurement | topic | § Closed-loop systems → Why autonomous systems need feedback | ✅ explained |
| 4 | Cooling system with continuous temperature measurement; signal proportional to difference | example (prof) | § Why autonomous systems need feedback → Example "Cooling system with temperature feedback" | ✅ explained |
| 4 | Fig: closed loop with Hata kontrolü, Hata sinyali, Kontrolcü, Uygulama sinyali, Sistem, Geri-besleme elemanları | diagram | § The closed-loop block diagram (ClosedLoopBD + label table) | ✅ reconstructed |
| 4 | Input represents desired output level | definition | § The closed-loop block diagram (table) | ✅ explained |
| 4 | Feedback elements = sensor-instrumentation circuit converting/scaling output | definition | § The closed-loop block diagram → Def "Feedback elements" | ✅ explained |
| 4–5 | Error zero when output reaches desired value; deviation re-activates system | topic | § When the error becomes zero | ✅ explained |
| 5 | "susturdur" handwriting | correction | § When the error becomes zero → Uncertain box | ✅ flagged |
| 5 | "System input becomes zero" simplification (not exact for integral / pure gain) | correction | § When the error becomes zero → Note "A simplification in the notes" | ✅ corrected & flagged |
| 5 | On/off controllers (refrigerator, air conditioner) | definition | § On/off and linear controllers → Def + plot | ✅ explained |
| 5 | Linear controllers: gain, derivative, integral | definition | § On/off and linear controllers → Def + bullets | ✅ explained |
| 5–6 | Comparison table open vs closed loop (5 rows) | topic | § Open-loop vs closed-loop comparison (table + reasons) | ✅ explained |
| 7 | Heading "Negatif Geribesleme" | topic | § Negative feedback | ✅ explained |
| 7 | Fig: R → Σ(+,−) →E→ [G] → C, feedback [H] | diagram | § Negative feedback (FeedbackLoopBD) | ✅ reconstructed |
| 7 | C = E·G, E = R − CH, C = (R−CH)G = RG − CHG, C + CHG = RG, C(1+HG) = RG | derivation | § Deriving the closed-loop transfer function → Example "Deriving the closed-loop transfer function" | ✅ solved & verified |
| 7 | Boxed C/R = T = G/(1+GH) | formula | § Deriving the closed-loop transfer function → KeyFormula | ✅ explained |
| 7 | Symbol list R, T, G, H (Turkish names) | definition | § The names in the notes (table) | ✅ explained |
| 7 | G called "açık çevrim kazancı" (vs standard forward gain / GH loop gain) | remark | § The names in the notes → Note "Terminology" | ✅ explained & flagged |
| 7 | HG vs GH order | remark | § The names in the notes (last paragraph) | ✅ explained |
| 6–7 | Accuracy of closed loop quantified (T ≈ 1/H, sensitivity) | topic | § Why feedback makes T insensitive to G (+ FeedbackSensitivityExplorer) | ✅ explained (supporting maths) |
| 8 | Heading "Bozucu Giriş (Gürültü)" + definition of noise | definition | § Disturbance input (noise) → Def | ✅ explained |
| 8 | Example: open doors/windows in heating/cooling system | example (prof) | § Disturbance input (noise) + Intuition; Exercise "Explain disturbance rejection in words" | ✅ explained |
| 8 | Disturbance may make system unstable or cause limited deviation | remark | § Disturbance input (noise); Note "The notes' warning about instability" | ✅ explained |
| 8 | Fig: R(s) → [G_a] → Σ(+, +N(s)) → [G_b] → C(s) | diagram | § Disturbance in an open-loop system (OpenLoopNoiseBD) | ✅ reconstructed |
| 8 | C(s)/N(s) = G_b (open loop, noise only) | formula | § Disturbance in an open-loop system → Example "Noise transfer function of the open-loop system" | ✅ solved & verified |
| 9 | Fig: closed loop with N(s) between G_a and G_b, feedback H | diagram | § Disturbance in a closed-loop system (ClosedLoopNoiseBD) | ✅ reconstructed |
| 9 | No signs on second Σ (assumed +) | remark | § Disturbance in a closed-loop system → Note "Signs on the second summing junction" | ✅ flagged |
| 9 | C(s)/N(s) = G_b/(1+G_aG_bH) | formula | § Disturbance in a closed-loop system → Example "Noise transfer function of the closed-loop system" | ✅ solved & verified |
| 8–9 | Why feedback reduces disturbances (comparison) | topic | § Why feedback suppresses disturbances (+ DisturbanceExplorer) | ✅ explained |
| 8–9 | Superposition of R and N contributions | derivation | § Reference and disturbance together | ✅ derived & verified |
| 2,5 | Turkish spelling slips ("sınıflandıra biliriz", "Burun", "sistemle-i") | remark | not shown (no effect on content); glossary § Turkish terminology | ✅ noted here only |

Additional teaching examples: 8 (Positive feedback: where the sign changes; Closed-loop gain with G = 10 and H = 1; Large loop gain: G = 100, H = 0.1; Feedback against a 50 percent drop of G; Common mistake: forgetting H in the comparator; Design: choose H for a required closed-loop gain; Disturbance attenuation with numbers; Superposition: a fair open-loop vs closed-loop comparison) · Professor's examples/derivations: 4 (cooling system p. 4, C/R derivation p. 7, C/N open loop p. 8, C/N closed loop p. 9) · Exercises: 19

Uncertain items: p. 5 "susturdur" (read as "the system goes quiet"); p. 9 signs on the second summing junction (taken as + from p. 8); p. 2 "sistemle-i" read as "sistemleri".


## Module 02 — 02 Giriş-Çıkış-Kararlılık.pdf

| Page | Item | Type | Website location | Status |
|---|---|---|---|---|
| 1 | Heading "Giriş-Çıkış ve Kararlılık"; three basic input functions, all inputs as combinations | topic | § The three basic test inputs (intro + table) | ✅ explained |
| 1 | Step function x(t)=A (t>0), 0 (t<0); A=1 ⇒ u(t); x=A·u(t) | definition / formula | § Step function (Def) | ✅ explained |
| 1 | Fig: step function with level A | graph | § Step function (`StepFunctionPlot`) | ✅ reconstructed |
| 2 | Impulse x(t)=0 (t≠0), ∞ (t=0) | definition | § Impulse function (Def) | ✅ explained |
| 2 | δ(t)=du/dt, ∫δ dt = 1 | formula / derivation | § Impulse function; § How the three inputs are related (+ `StepToImpulseExplorer`) | ✅ explained & derived |
| 2 | Fig: impulse arrow at t=0 | graph | § Impulse function (`ImpulsePlot`) | ✅ reconstructed |
| 2 | Ramp x(t)=At (t≥0), 0 (t<0); unit ramp R(t) | definition | § Ramp function (Def) | ✅ explained |
| 2 | Fig: ramp through (1, A) with dashed guides | graph | § Ramp function (`RampFunctionPlot`) | ✅ reconstructed |
| 2 | u(t)=dR(t)/dt | formula / derivation | § How the three inputs are related | ✅ explained & derived |
| 2/10/4 | Notation R(t) vs r(t) vs reference r(t) | correction | § Ramp function, Uncertain box | ✅ flagged |
| 1–2 | t>0 (step) vs t≥0 (ramp) | remark | § Ramp function, Note box | ✅ flagged |
| 3 | Stability / BIBO definition | definition | § Stability (BIBO) | ✅ explained |
| 3 | Fig: "Kararlı Sistem" (blue underdamped, pink overdamped) | graph | § Stable and unstable responses (`StablePlot`, illustrative functions) | ✅ reconstructed |
| 3 | Fig: unstable (blue exponential growth, pink growing oscillation) | graph | § Stable and unstable responses (`UnstablePlot`, illustrative functions) | ✅ reconstructed |
| 4 | Heading "Sistem Çıkışı ve Kontrol Kriterleri"; use unit step response | topic | § Step response performance criteria | ✅ explained |
| 4 | Fig: annotated unit step response (r=1, y_ss, t_r, t_p, t_s, m, e_ss, Geçici/Kalıcı Durum) | graph | § The annotated unit step response (`AnnotatedStepResponse` + interactive `StepCriteriaExplorer`) | ✅ reconstructed |
| 5 | Rise time t_r (0 → first reaching y_ss) | definition | § Definitions of the parameters (+ Note on 10–90%) | ✅ explained |
| 5 | Steady-state value y_ss | definition | § Definitions of the parameters | ✅ explained |
| 5 | Maximum overshoot m (from y_ss) | definition | § Definitions of the parameters | ✅ explained |
| 4–5 | Symbol m vs M; t_p not separately defined | remark | § Definitions, Uncertain box | ✅ flagged |
| 5 | Settling time t_s ("first enters" wording) | definition / correction | § Definitions, Def + Correction Note | ✅ corrected & flagged |
| 5 | Steady-state error e_ss = 1 − y_ss | definition | § Definitions of the parameters | ✅ explained |
| 5 | "(ess)" written instead of "(y_ss)" | correction | § Definitions, Correction Note | ✅ corrected & flagged |
| 6 | Transfer function definition | definition | § Transfer function | ✅ explained |
| 6 | Analytical vs system identification (transformer tests, human body) | topic | § Transfer function; § System identification | ✅ explained |
| 6 | Differential equations as typical models | remark | § A differential-equation model | ✅ explained |
| 6 | ODE example y''+2y'+3y = 4u'+5u | example (prof) | § A differential-equation model → Example "The professor's ODE example" | ✅ explained (steady state, TF preview (4s+5)/(s²+2s+3) verified) |
| 7 | Fig: series RC circuit (V_s, R, I, C, V_c) | circuit | § Modelling a series RC circuit (`RCCircuit`) | ✅ reconstructed |
| 7 | I=C dV_c/dt, I=(V_s−V_c)/R ⇒ V_s=RC dV_c/dt + V_c; V_c/V_s=? | example (prof) | § Modelling a series RC circuit → Example "Series RC circuit model" | ✅ solved & verified (TF 1/(RCs+1) as forward pointer to M05) |
| 7 | "Solving is needed for any V_s" | remark | same example, last step | ✅ explained |
| 8 | Why Laplace: tiring DE methods, repeat per input, stability needs time response, avoid convolution | topic | § Why the Laplace transform? | ✅ explained |
| 8 | e^{st} space, s-plane covers real & imaginary axes / frequency | topic | § The exponential building block (+ `ExpSTExplorer`) | ✅ explained |
| 8 | e^0 = constant; e^{∓t} decay/growth; e^{jωt}=cos ωt + j sin ωt oscillation/phase | formula | § The exponential building block (table); § Euler's formula | ✅ explained & derived |
| 8 | ∓ vs ± sign | remark | § The exponential building block, Uncertain box | ✅ flagged |
| 9 | Laplace definition F(s)=∫₀^∞ f e^{−st} dt | definition | § Laplace definition (+ `LaplaceIntegralExplorer`) | ✅ explained |
| 9 | Heading "Temel Fonksiyonların Laplace Dönüşümleri"; Fig: unit step | graph | § Transform of the unit step (step figure shown earlier in § Step function, A=1 case) | ✅ explained |
| 9 | L{u}=1/s | example (prof) | § Transform of the unit step → Example "Laplace transform of the unit step" | ✅ solved & verified |
| 9 | Faint minus in first e^{−st} | remark | § Transform of the unit step, Uncertain box | ✅ flagged |
| 10 | Fig: unit ramp r(t) | graph | § Ramp function (RampFunctionPlot; A=1 case) | ✅ explained |
| 10 | L{r}=1/s² (steps missing in notes) | example (prof) | § Transform of the unit ramp → Example "Laplace transform of the unit ramp" | ✅ solved & verified (integration by parts) |
| 10 | Fig: unit impulse δ(t) | graph | § Impulse function (`ImpulsePlot`) | ✅ reconstructed |
| 10 | δ(t)=1 at t=0 (contradicts p. 2) | correction | § Transform of the unit impulse, Correction Note | ✅ corrected & flagged |
| 10 | L{δ}=e^0∫δ dt = 1; lower limit 0 vs 0⁻ | example (prof) | § Transform of the unit impulse → Example "Laplace transform of the unit impulse" + Note "Why 0⁻" | ✅ solved & verified |

Additional teaching examples: 13 · Exercises: 20
Uncertain items: m vs M (p. 4–5); ∓ vs ± (p. 8); faint minus in e^{−st} (p. 9). Stability sketches and the annotated step response use illustrative functions (shapes match; the notes give no formulas or numbers).


## Module 03 — 03 Laplace Dönüşümü.pdf

| Page | Item | Type | Website location | Status |
|---|---|---|---|---|
| 1 | Laplace Dönüşümü — definition $F(s)=\int_0^\infty f e^{-st}dt$ | definition | § The definition | ✅ explained |
| 1 | Temel Fonksiyonların Laplace Dönüşümleri (basic functions) | topic | § Transforms of basic functions | ✅ explained |
| 1 | Fig: unit step u(t) | graph | § Unit step (`StepPlot`) | ✅ reconstructed |
| 1 | Unit step definition and $\L\{u\}=1/s$ derivation | derivation | § Unit step | ✅ explained |
| 2 | Fig: unit ramp r(t) | graph | § Unit ramp (`RampPlot`) | ✅ reconstructed |
| 2 | Unit ramp definition, $\L\{r\}=1/s^2$ | derivation | § Unit ramp (integration by parts added) | ✅ explained |
| 2 | Fig: unit impulse δ(t) | graph | § Unit impulse (`ImpulsePlot`, `ImpulseLimitExplorer`) | ✅ reconstructed |
| 2 | Impulse definition, $\L\{\delta\}=1$ | derivation | § Unit impulse | ✅ explained |
| 2 | Informal δ(0)=1, lower limit 0⁻ | correction | § Unit impulse → Note "Correction to the notes" | ✅ corrected & flagged |
| 3 | Üstel Fonksiyonlar: $e^{-at}u(t)\to\frac{1}{s+a}$ | derivation | § Exponential function | ✅ explained |
| 3 | Euler form of sin; $\L\{A\sin\omega t\}=A\omega/(s^2+\omega^2)$ | derivation | § Sine function | ✅ explained |
| 3 | Heading "exponential functions" also covers sin/cos | remark | § Exponential function (intro sentence) | ✅ explained |
| 4 | Euler form of cos; $\L\{A\cos\omega t\}=As/(s^2+\omega^2)$ | derivation | § Cosine function | ✅ explained |
| 5 | Laplace Dönüşümünün Özellikleri | topic | § Properties of the Laplace transform | ✅ explained |
| 5 | Doğrusallık (linearity) | formula | § Linearity | ✅ explained + derivation |
| 5 | Üstel ile Çarpma (s-shift) | formula | § Multiplication by an exponential (`SShiftExplorer`) | ✅ explained + derivation |
| 5 | Rampa ile Çarpma ($t^n$) | formula | § Multiplication by t (ramp multiplication) | ✅ explained + derivation |
| 5 | İlk Değer Teoremi (IVT) | formula | § Initial value theorem | ✅ explained + justification |
| 5 | Son Değer Teoremi (FVT) | formula | § Final value theorem | ✅ explained + justification |
| 5 | FVT validity conditions not stated | correction | § Final value theorem → Note "When the FVT is NOT valid", `FvtFailPlot` | ✅ added & flagged |
| 5 | Öteleme Özelliği (time shift), implicit $u(t-t_0)$ | formula | § Time shift (`TimeShiftExplorer`) | ✅ explained + derivation |
| 6 | Türev Özelliği (derivative property), başlangıç değerleri, $f^{n-1}$ notation | formula | § Derivative property | ✅ explained + derivation |
| 6 | İntegral Özelliği | formula | § Integral property | ✅ explained + derivation |
| 6 | Example: $\dot y+3y+\int y=u$, $y(0)=1$ → $Y(s)$ | example (prof) | § Professor's examples → "Integro-differential equation to Y(s)" | ✅ solved & verified |
| 7 | Example: $\L\{e^{-2t}t\sin4t+5\delta(t-2)\}$ | example (prof) | § Professor's examples → "Transform of a damped t sin 4t plus a delayed impulse" | ✅ solved & verified |
| 7 | Example: IVT/FVT for $\frac{s+2}{s(s^2+2s+4)}$ | example (prof) | § Professor's examples → "Initial and final values from F(s)" (`P7IvtFvtPlot`) | ✅ solved & verified |
| 8 | Ters Laplace Dönüşümü — table/properties method | topic | § Inverse Laplace transform | ✅ explained |
| 8 | Example: 5-term inverse by table | example (prof) | § Inverse Laplace transform → "Inverse transform by table" | ✅ solved & verified |
| 8 | Table pairs used implicitly ($n!/s^{n+1}$, $1/(s+a)^2$, damped cos, sin) | formula | § Transform table | ✅ explained |
| 9 | Reduction methods / Basit Kesirlere Ayırma Yöntemi | topic | § Partial fraction expansion | ✅ explained |
| 9 | Gerçek ve Ayrık Kök Durumu: expansion and $f(t)=\sum K_ie^{-p_it}$ | formula | § Distinct real roots | ✅ explained |
| 9 | "p kökleri" wording (poles are $-p_i$) | remark | § Distinct real roots → Note | ✅ flagged |
| 10 | $K_i=\lim_{s\to-p_i}(s+p_i)F(s)$ | formula | § Distinct real roots (why it works) | ✅ explained + derivation |
| 10 | Example: $\frac{s^2+2s+2}{(s+1)(s+2)(s-3)}$ | example (prof) | § Distinct real roots → "Partial fractions with three distinct real roots" | ✅ solved & verified |
| 11 | Gerçek ve Katlı Kök Durumu: expansion, $f(t)$, $K_i$ derivative formula | formula | § Repeated real roots (why derivatives) | ✅ explained + derivation |
| 11 | "s=p" / "$s\to p$" should be $s=-p$ | correction | § Repeated real roots → Note | ✅ corrected & flagged |
| 12 | Example: $\frac{s+3}{(s+1)^3(s+2)}$ | example (prof) | § Repeated real roots → "Partial fractions with a triple root" | ✅ solved & verified |
| 13 | Karmaşık Kök Durumu: $K,K^*$, Euler derivation, $2\lvert K\rvert e^{-\alpha t}\cos(\omega t+\theta)$ | derivation | § Complex roots | ✅ explained + derivation |
| 13 | Roots written $\alpha\pm j\omega$, should be $-\alpha\pm j\omega$ | correction | § Complex roots → Note | ✅ corrected & flagged |
| 14 | Example: $\frac{s+1}{(s+2)(s^2+2s+2)}$ | example (prof) | § Complex roots → "Partial fractions with complex roots" | ✅ solved & verified |
| 14 | Final answer missing $e^{-t}$ | correction | § Complex roots → Note + `P14ComparePlot`, Exercise "Checking the p14 answer…" | ✅ corrected & flagged |
| 15 | Example: completing the square $\frac{s+2}{s^2+2s+4}$, amplitude–phase 1.155∠−30° | example (prof) | § Completing the square → "Inverse by completing the square" | ✅ solved & verified |

Interactive widgets: `PartialFractionViewer` (6 cases incl. p10, p12, p14, p15), `SShiftExplorer`, `TimeShiftExplorer`, `ImpulseLimitExplorer`.

Additional teaching examples: 14 · Exercises: 23
Uncertain items: p3 faint minus in $e^{-j\omega t}$ (read as minus, consistent with Euler); p8 numerator "2,5·2" (confirmed by result 2,5 sin 2t). No unresolved items.


## Module 04 — 04-Blok-Şemalar-ve-Akış-Şemaları.pdf

| Page | Item | Type | Website location | Status |
|---|---|---|---|---|
| 1 | Title "Blok Şemalar" | topic | § Operation blocks and block diagrams | ✅ explained |
| 1 | Definition of operation block (işlem bloğu), signals as Laplace functions | definition | § Operation block; § Signals are Laplace functions | ✅ explained |
| 1 | Definition of block diagram (blocks joined by flow-direction lines) | definition | § Operation block (Def box) | ✅ explained |
| 1 | Need to combine blocks for holistic analysis (bütünsel analiz) | remark | § The professor's two-loop example | ✅ explained |
| 1 | Summing junction Σ with signs; take-off point (dot) | topic | § Summing junctions; § Take-off points (figures) | ✅ explained |
| 1 | Fig 1.1: two-loop system G1, G2, G3, H1, H2 | diagram | § The professor's two-loop example (TwoLoopFig, plain + annotated) | ✅ reconstructed |
| 1 | $X=\{(R-H_1X)G_1-H_2Y\}G_2$, $Y=G_3X$ | formula | § Writing the equations → Example "Two-loop system: overall transfer function" | ✅ explained |
| 1 | "(R−X,X)" written instead of (R−H1X) | correction | § Writing the equations, Uncertain box | ✅ corrected & flagged |
| 2 | $X=\frac{G_1G_2R-G_2H_2Y}{1+G_1G_2H_1}$ | derivation | Example "Two-loop system…" step 3 | ✅ solved & verified |
| 2 | Intermediate denominator "1+G1G2H" (missing subscript) | correction | § Writing the equations, Uncertain box | ✅ corrected & flagged |
| 2 | $T(s)=\frac{G_1G_2G_3}{1+G_1G_2H_1+G_2G_3H_2}$ | formula | Example "Two-loop system…" (also re-derived by reduction in additional example) | ✅ solved & verified |
| 2 | Example p.1–2 two-loop system | example (prof) | § Writing the equations → Example "Two-loop system: overall transfer function" | ✅ solved & verified |
| 2 | Intro to reduction techniques (blok sadeleştirme) | remark | § Eliminating X (end), § Reduction techniques | ✅ explained |
| 3 | Fig 3.1: summing point moved ahead of G1 (1/G1) | diagram | § Rule 1 (Rule1Fig) + proof | ✅ reconstructed |
| 3 | Block "R2" should be G2 | correction | § Rule 1, Uncertain box | ✅ corrected & flagged |
| 3 | Fig 3.2: take-off point moved before G2 (feedback block G2) | diagram | § Rule 2 (Rule2Fig) + proof | ✅ reconstructed |
| 3 | Fig 3.3: canonical loop ⟺ G/(1+GH) | diagram | § Rule 3 (Rule3Fig) + proof | ✅ reconstructed |
| 3 | $\frac{Y}{R}=\frac{G}{1+GH}$ | formula | § Rule 3, KeyFormula | ✅ explained |
| 4 | Example (Örnek) three-loop system G1–G4, H1–H3 | example (prof) | § The three-loop example → Example "Three-loop system: complete reduction" | ✅ solved & verified (completed) |
| 4 | Fig 4.1: original three-loop diagram | diagram | § The original diagram (ThreeLoopFig) | ✅ reconstructed |
| 4 | Missing sign at H1 input of Σ1 (top diagram) | correction | § The original diagram, Uncertain box | ✅ flagged (− used, per lower diagram) |
| 4 | Fig 4.2: H1 take-off moved to output with 1/(G3G4), inner loop circled | diagram | § Moving the H1 take-off point (ThreeLoopMovedFig with dashed ring) | ✅ reconstructed |
| 4 | Pickoff move compensating block 1/(G3G4) | formula | § Moving the H1 take-off point | ✅ explained |
| 4 | $G_A=\frac{G_2G_3}{1+G_2G_3H_2}$ | formula | § The inner loop, KeyFormula | ✅ explained |
| 4 | Example unfinished in notes | remark | § Completing the reduction (steps 3–6 labelled as completion), § Checking by algebra, stepper widget | ✅ completed & verified independently |
| — | File title mentions Akış Şemaları but no SFG content | remark | § What is this about? Note box | ✅ stated |

Additional teaching examples: 7 (single loop ±feedback numeric; two-loop numeric; two-loop by reduction; common mistake forgetting compensating block; parallel inside loop; feed-forward with summing-point move; numeric spot-check of p.4 result) · Exercises: 17
Interactive widgets: 2 step-by-step reduction steppers (p.4 three-loop, p.1 two-loop).
Uncertain items: p.1 "(R−X,X)"; p.2 "1+G1G2H"; p.3 "R2"; p.4 missing sign at H1 input and unlabelled input in lower diagram. Turkish terms "toplama noktası"/"ayrılma noktası" are standard textbook terms, not written in the notes (notes draw Σ and a dot).


## Module 05 — 05 Elektriksel Sistemlerin Modellenmesi.pdf

| Page | Item | Type | Website location | Status |
|---|---|---|---|---|
| 1 | Intro: Laplace applied to element differential equations gives s-domain representations; circuit analysis in Laplace domain gives s- and time-domain solutions | topic | § What is this about? (quoted + translated); § From circuit to transfer function: the chain | ✅ explained |
| 1 | Resistor (Direnç) time-domain element drawing (i(t) →, + v(t) −) | circuit | § Resistor (`Element kind="R"`) | ✅ reconstructed |
| 1 | $v(t)=Ri(t)\Rightarrow R=v/i$ | formula | § Resistor | ✅ explained |
| 1 | "No derivative or delay operator" remark | remark | § Resistor | ✅ explained |
| 1 | Resistor s-domain drawing (I(s), + V(s) −) | circuit | § Resistor (`Element kind="R" s`) | ✅ reconstructed |
| 1 | $V(s)=RI(s)\Rightarrow R=V(s)/I(s)$ | formula | § Resistor; formulas `resistor-law` | ✅ explained |
| 2 | Capacitor (Sığaç/Kondansatör) time-domain drawing | circuit | § Capacitor | ✅ reconstructed |
| 2 | $i=C\,dv/dt$ | formula | § Capacitor law in the time domain | ✅ explained (origin q=Cv, physical meaning, continuity) |
| 2 | $v(t)=\frac1C\int_0^t i\,dt+v(0)$ | formula/derivation | § Integral form and the initial voltage | ✅ derived; dummy-variable notation remarked |
| 2 | Definition of $v(0)$ (başlangıçtaki kapasitans gerilimi) | definition | § Integral form and the initial voltage (Def) | ✅ explained |
| 2 | Capacitor s-domain drawing | circuit | § Laplace transform of the capacitor law | ✅ reconstructed |
| 2 | $I(s)=sCV(s)-Cv(0)$; $V(s)=\frac{1}{sC}I(s)+\frac{v(0)}{s}$ | formula/derivation | § Laplace transform of the capacitor law (KeyFormula, both derived, equivalence shown) | ✅ derived |
| 2 | $v(0)=0\Rightarrow V=\frac{1}{sC}I$ | formula | same section | ✅ explained |
| 2 | Impedance $Z_C=V/I=1/(sC)$ | formula | § Capacitor impedance (KeyFormula + Mistake box) | ✅ explained |
| 3 | Inductor (Endüktans) time-domain drawing | circuit | § Inductor | ✅ reconstructed |
| 3 | $v=L\,di/dt$ | formula | § Inductor law in the time domain | ✅ explained |
| 3 | $i(t)=\frac1L\int_0^t v\,dt+i(0)$; definition of $i(0)$ | formula/definition | § Integral form and the initial current | ✅ explained |
| 3 | Inductor s-domain drawing | circuit | § Laplace transform of the inductor law | ✅ reconstructed |
| 3 | $V(s)=sLI(s)-Li(0)$; $I(s)=\frac{1}{sL}V(s)+\frac{i(0)}{s}$; $i(0)=0$ case | formula/derivation | § Laplace transform of the inductor law | ✅ derived |
| 3 | Impedance $V/I=sL$ | formula | § Inductor impedance (named $Z_L$, noted that notes give no symbol) | ✅ explained |
| 4 | Example: series RC circuit drawing (V_s, R, C, V_c) | circuit | § RC step response via the ODE (`RCTime`) | ✅ reconstructed |
| 4 | ODE $V_s=RC\,dV_c/dt+V_c$, $V_c(0)=0$, $V_s=u(t)$ | formula | Example "RC step response via the differential equation" | ✅ explained (links Module 02 p.7) |
| 4 | Laplace, PF ($A=1$, $B=-RC$), $V_c(t)=1-e^{-t/RC}$ | example (prof) | Example "RC step response via the differential equation" | ✅ solved & verified |
| 4 | ZSR (sıfır durum tepkesi) remark | definition | § Zero-state response (Def) | ✅ explained |
| 5 | II. yol: s-domain RC circuit (1/s, R, 1/sC, V_c) | circuit | § Second way (`RCs`) | ✅ reconstructed |
| 5 | Voltage divider with impedances; "impedances treated like resistances" | example (prof) | Example "RC step response with impedances (II. yol)" | ✅ solved & verified |
| 5 | Underbrace remark "reuse previous result"; closing remark "same solution both ways, no ODE needed" | remark | same example + § Comparing the two ways | ✅ explained |
| 6 | Series RLC time-domain circuit (V_i, R, L, C, V_o) | circuit | § Series RLC transfer function (`RLCTime`) | ✅ reconstructed |
| 6 | Series RLC s-domain circuit (V_i(s), R, Ls, 1/Cs, V_o(s)) | circuit | same (`RLCs`) | ✅ reconstructed |
| 6 | Voltage divider → $H(s)=1/(LCs^2+RCs+1)$ | example (prof) | Example "Series RLC transfer function" | ✅ solved & verified (also via ODE) |
| — | No graphs in the notes; RC charging curve added as plot + interactive | graph | § The RC charging curve | ✅ added |

Additional teaching examples: 7 (charged capacitor with constant current; RC output across R; series RL; RC with nonzero initial voltage; numerical RC; numerical RLC; common-mistakes example) · Exercises: 18
Interactive widgets: RC charging explorer (R, C, V_s); series RLC step-response explorer (R, L, C, with poles on s-plane).
Uncertain items: none in the source (no [NOTE] corrections in transcript). s-domain element models with initial-condition sources are drawn by us from the notes' equations (the notes give only the equations); zero-input response is mentioned only by name as the complement of the ZSR.


## Module 06 — 06 Birinci Derece Sistemlerim Zaman Tepkesi.pdf

| Page | Item | Type | Website location | Status |
|---|---|---|---|---|
| 1 | Title "Kontrol Sistemlerinin Zaman Bölgesi Karakteristikleri" / "Birinci Dereceden Kontrol Sistemleri" | topic | § What is this about? | ✅ explained |
| 1 | Fig: unity negative-feedback loop with 1/(τs) | diagram | § The standard first-order loop → The block diagram (BD reconstructed) | ✅ reconstructed |
| 1 | T(s)=1/(τs+1) | formula | § Deriving T(s) → Example "Deriving T(s) for the standard first-order loop" | ✅ derived (G/(1+G)) |
| 1 | Unit impulse response y=(1/τ)e^{-t/τ} | derivation | § Unit impulse response → Derivation | ✅ explained |
| 1 | Fig: impulse response with tangent hitting τ, ticks τ, 4τ, 5τ | graph | § The graph and the meaning of tau (ImpulsePlot) | ✅ reconstructed |
| 1 | τ is the time constant; decay time 4τ–5τ | definition | § The graph and the meaning of tau (table e^{-n}) | ✅ explained |
| 2 | Slope at t=0 = −1/τ² | formula | § Initial slope of the impulse response | ✅ explained |
| 2 | Missing minus in intermediate derivative | correction | § Initial slope … → Note "Correction to the notes (p. 2)" | ✅ corrected & flagged |
| 2 | e_ss definition (time domain and lim s[R−Y]); impulse e_ss=0 both ways | definition | § Steady-state error definition | ✅ explained |
| 2 | Step input R(s)=1/s introduced | topic | § Unit step response | ✅ explained |
| 3 | Step response partial fractions, y=1−e^{-t/τ} | derivation | § Derivation of the step response | ✅ derived & recombined |
| 3 | Fig: step response, r(t)=1 level, tangent reaching 1 at τ | graph | § The step response graph (StepPlot) | ✅ reconstructed |
| 3 | Settling time 4τ–5τ | definition | § Settling time (98.2 %/99.3 %, τ ln 50) | ✅ explained |
| 3 | Slope 1/τ at t=0 | formula | § Time constant on the step curve | ✅ explained |
| 3 | Step e_ss=0 | formula | § Step steady-state error | ✅ explained |
| 4 | Ramp response partial fractions, y=t−τ+τe^{-t/τ} | derivation | § Partial fractions for the ramp | ✅ derived (A, B, C in full) |
| 4 | Fig: ramp response parallel to r(t) with gap τ | graph | § The constant lag tau (RampPlot) | ✅ reconstructed |
| 4 | Output follows input with difference τ | remark | § The constant lag tau | ✅ explained |
| 5 | Ramp e(t) and e_ss=τ with cancellations | derivation | § Ramp steady-state error | ✅ explained |
| 5 | Fig: Example 1 block diagram 4/(s+1) | diagram | § Example 1 with DC gain below one (Ex1LoopBD) | ✅ reconstructed |
| 5 | Example 1: T=4/(s+5)=0.8/(0.2s+1) | example (prof) | § Example 1 → Example "Example 1: closed-loop transfer function of G = 4/(s+1)" | ✅ solved & verified |
| 5 | Example 1: step response y=0.8(1−e^{-5t}), e_ss=0.2 | example (prof) | § Example 1 step response → Example "Example 1: unit step response" | ✅ solved & verified |
| 6 | Fig: Example 1 step graph (levels 1, 0.8; t=1) | graph | § Example 1 step response (Ex1StepPlot) | ✅ reconstructed |
| 6 | Example 1: impulse response, y(0)=4, y(∞)=0, e_ss=0, y=4e^{-5t} | example (prof) | § Example 1 impulse response → Example "Example 1: unit impulse response" | ✅ solved & verified |
| 6 | y(∞) limit written s→∞ instead of s→0 | correction | § Example 1 impulse response → Note "Correction to the notes (p. 6)" | ✅ corrected & flagged |
| 6 | Initial / final value theorems | formula | § Initial and final value theorems | ✅ explained |
| 6 | Fig: Example 1 impulse graph (from 4, ~0 at t=1) | graph | § Example 1 impulse response (Ex1ImpulsePlot) | ✅ reconstructed |
| 7 | Example 1: ramp partial fractions 0.8, −0.16, 0.16; y=0.8t−0.16+0.16e^{-5t} | example (prof) | § Example 1 ramp response → Example "Example 1: unit ramp response" | ✅ solved & verified |
| 7 | y_ss=0.8t−0.16, e_ss=0.2t+0.16, s-domain e_ss=∞ | derivation | same Example (steps 3–5) + "Why infinite?" | ✅ explained |
| 7 | Fig: diverging r(t) and y(t) | graph | § Example 1 ramp response (Ex1RampPlot) | ✅ reconstructed |
| 8 | Fig: Example 2 block diagram s/(s+1), no signs | diagram | § Example 2 (Ex2LoopBD) + Uncertain box on signs | ✅ reconstructed & flagged |
| 8 | Example 2: T=s/(2s+1)=0.5s/(s+0.5)=0.5−0.25/(s+0.5) | example (prof) | § Biproper transfer functions → Example "Example 2: closed-loop transfer function of G = s/(s+1)" | ✅ solved & verified |
| 8 | Example 2: impulse response 0.5δ(t)−0.25e^{-0.5t} | example (prof) | § Example 2 impulse response → Example "Example 2: unit impulse response" | ✅ solved & verified |
| 8 | Fig: Example 2 impulse graph (arrow at 0, curve from −0.25) | graph | § Example 2 impulse response (Ex2ImpulsePlot, true time scale) | ✅ reconstructed |
| 8 | Misleading time scale of the graph (τ=2 s) | correction | § Example 2 impulse response → Note "Correction to the notes (p. 8 graph time scale)" | ✅ corrected & flagged |
| 9 | IVT "problematic"; y(0+)=−0.25 (impulse term silently dropped) | remark | § Initial value theorem with an impulse + Uncertain box | ✅ explained & flagged |
| 9 | y(∞)=0, e_ss=0 for Example 2 | formula | § Example 2 impulse response (steps 3–4) | ✅ solved & verified |

Additional teaching examples: 8 (RC circuit; 5/(s+2); 10/(2s+1); standard loop τ=0.5 ramp; loop 9/(s+1) open vs closed τ; choosing K for t_s; reading τ from a measured graph; Example 2 with a step input) · Exercises: 17
Interactive widgets: FirstOrderExplorer (τ, K → impulse/step/ramp, tangents, 63.2 % point, 4τ, pole, e_ss readouts); LoopExplorer (K, a → open- vs closed-loop pole, step response, e_ss)
Uncertain items: p8 summing-junction signs not drawn (negative feedback inferred); p8 impulse arrow height not labelled (area 0.5 from the formula); p1 two unlabelled ticks between τ and 4τ (drawn as 2τ, 3τ).


## Module 07 — 07 İkinci Derece Sistemlerim Zaman Tepkesi.pdf

| Page | Item | Type | Website location | Status |
|---|---|---|---|---|
| 1 | Second-order control system (İkinci derece kontrol sistemleri) | topic | § The standard second-order system | ✅ explained |
| 1 | Fig: unity-feedback loop with ω_n²/[s(s+2ξω_n)] | diagram | § The standard second-order system (StandardLoopBD) | ✅ reconstructed |
| 1 | ω_n natural frequency (doğal frekans), ξ damping factor (sönüm faktörü) | definition | § The standard second-order system (Def boxes) | ✅ explained |
| 1 | T(s)=ω_n²/(s²+2ξω_ns+ω_n²) | formula / derivation | § Deriving the closed-loop transfer function | ✅ derived (G/(1+G)) |
| 1 | Roots s₁,₂=−ξω_n±ω_n√(ξ²−1) | formula / derivation | § Roots of the characteristic equation | ✅ derived (quadratic formula) |
| 2 | Three cases by ξ | topic | § Three damping cases (table) | ✅ explained |
| 2 | ξ>1 overdamped, real distinct roots (aşırı sönümlü) | definition | § Overdamped case | ✅ explained |
| 2 | ξ=1 critically damped, s₁,₂=−ω_n (kritik sönümlü) | definition | § Critically damped case | ✅ explained |
| 2 | ξ<1 underdamped, s=−α±jω=−ξω_n±jω_n√(1−ξ²) (düşük sönümlü) | definition / formula | § Underdamped case, § Geometry of the complex roots | ✅ explained |
| 2 | Case 3 strictly 0<ξ<1 | remark | § Underdamped case (Note) | ✅ flagged |
| 2 | Fig: Example 1 block diagram 2/(s²+2s+2) | diagram | § Example 1 (Example1BD) | ✅ reconstructed |
| 2–3 | Example 1: type and parameters (T=2/(s²+2s+4), ω_n=2, ξ=0.5, α=1, ω=1.732) | example (prof) | § Example 1 → "Example 1: type and parameters of the system" | ✅ solved & verified |
| 3 | Example 1 DC gain 0.5 not mentioned | remark | § Example 1 (Note "The numerator is not ω_n² here") | ✅ explained |
| 3 | Unit impulse response; overdamped Y(s)=K₁/(s+p₁)+K₂/(s+p₂) | derivation | § Impulse: overdamped | ✅ derived (K₁,K₂ evaluated) |
| 4 | p₁,p₂ definitions, s₁=−p₁, s₂=−p₂ | formula | § Overdamped case, § Impulse: overdamped | ✅ explained |
| 4 | y(t)=k₁e^{−p₁t}+k₂e^{−p₂t} | formula | § Impulse: overdamped | ✅ derived |
| 4 | Fig: impulse responses ξ=0.25, 1, 2 + remark "more damping → less oscillation" | graph | § Impulse response family (ImpulseFamily) | ✅ reproduced with exact functions (ω_n=1) |
| 5 | Critically damped impulse y=ω_n²te^{−ω_nt} | formula | § Impulse: critically damped | ✅ derived |
| 5 | s₁,₂=ω_n missing minus | correction | § Impulse: critically damped (Note) | ✅ corrected & flagged |
| 5 | Underdamped impulse: K=−ω_n²/(2jω), K*=ω_n²/(2jω) | derivation | § Impulse: underdamped | ✅ derived |
| 6 | Euler step → y=(ω_n²/ω)e^{−αt}sinωt=(ω_n/√(1−ξ²))e^{−αt}sinωt | formula / derivation | § Impulse: underdamped | ✅ derived, checked with conjugate-pair rule |
| 6 | Impulse e_ss=0 | formula | § Steady-state error for the impulse | ✅ derived |
| 6, 7, 8, 10, 14 | Denominator written s²+2ξω_n+ω_n² (missing s) | correction | § Steady-state error for the impulse (Note) | ✅ corrected & flagged |
| 7 | Unit step: Y(s)=(1/s)T(s); overdamped K₁/s+K₂/(s+p₁)+K₃/(s+p₂), y=K₁+K₂e^{−p₁t}+K₃e^{−p₂t} | derivation | § Step: overdamped | ✅ derived (general coefficients added) |
| 8 | Critical step: K₁=1, K₃=−ω_n, K₂=−1 (derivative formula), y=1−e^{−ω_nt}−ω_nte^{−ω_nt} | derivation | § Step: critically damped | ✅ derived & verified |
| 9 | Underdamped step y=1−e^{−αt}[cosωt+ξ/√(1−ξ²) sinωt] | derivation | § Step: underdamped | ✅ full K₂ computation added |
| 9 | Amplitude-phase form, θ=tan⁻¹(√(1−ξ²)/ξ) | formula / derivation | § Amplitude-phase form of the step response | ✅ derived via a cos x + b sin x identity |
| 10 | Fig: step responses ξ=2, 1, 0.25 with dashed final value | graph | § Step response family (StepFamily) | ✅ reproduced with exact functions |
| 10 | Sketch: ξ=1, 2 curves start with non-zero slope | correction | § Why every step response starts flat (Note + InitialSlopeZoom) | ✅ corrected & flagged (IVT + derivative argument) |
| 10 | Step e_ss=0 | formula | § Steady-state error for the step | ✅ derived |
| 11 | Unit ramp: Y=(1/s²)T(s); overdamped K₁/s²+K₂/s+K₃/(s+p₁)+K₄/(s+p₂), y=K₁t+K₂+K₃e^{−p₁t}+K₄e^{−p₂t} | derivation | § Unit ramp response, § Ramp: overdamped | ✅ derived (general coefficients added) |
| 12 | Critical ramp K₁=1, K₂=−2/ω_n, K₃=1 | derivation | § Ramp: critically damped | ✅ derived |
| 12 | K₂ denominator missing square on ω_n | correction | § Ramp: critically damped (Note) | ✅ corrected & flagged |
| 13 | K₄=2/ω_n; y=t−2/ω_n+te^{−ω_nt}+(2/ω_n)e^{−ω_nt} | derivation | § Ramp: critically damped | ✅ derived & verified |
| 13 | Underdamped ramp partial fractions K₁/s²+K₂/s+K₃/(s+p₁)+K₃*/(s+p₂) | derivation | § Ramp: underdamped | ✅ derived (polar K₃) |
| 13 | Ramp phase written θ instead of 2θ | correction | § Ramp: underdamped (Note), § Why the phase is 2 theta | ✅ corrected, derived two ways, verified numerically |
| 14 | θ definition (repeated) | formula | § Ramp: underdamped | ✅ explained |
| 14 | Ramp e_ss=2ξ/ω_n | formula / derivation | § Steady-state error for the ramp | ✅ derived |
| 14 | Fig: ramp responses ξ=2, 1, 0.25 with dashed r(t) | graph | § Ramp response family (RampFamily) | ✅ reproduced with exact functions |
| 15 | Fig: Example 2 block diagram 20/(s²+4s+5) | diagram | § Example 2 (Example2BD) | ✅ reconstructed |
| 15 | Example 2: T=20/(s²+4s+25)=0.8·25/(…), ω_n=5, ξ=0.4, roots −2±j4.58 | example (prof) | § Example 2 → "Example 2: impulse, step and ramp responses" | ✅ solved & verified |
| 15 | Example 2 impulse y=4.364e^{−2t}sin4.58t | example (prof) | same | ✅ solved & verified (RK4) |
| 16 | Example 2 impulse e_ss=0; sketch | example (prof) / graph | same; § Impulse response of Example 2 (Ex2Impulse) | ✅ solved; graph reproduced |
| 16 | Example 2 step y=0.8[1−e^{−2t}(cos4.58t+0.436sin4.58t)], e_ss=0.2; sketch with lines 1 and 0.8 | example (prof) / graph | same; § Step response of Example 2 (Ex2Step) | ✅ solved & verified; graph reproduced |
| 16–17 | Example 2 ramp response | example (prof) | same | ✅ solved with corrected phase |
| 17 | Phase 66.42° should be 132.84°; 0.174 → 0.1746 | correction | § Ramp response of Example 2 (Note + RampPhaseCheck) | ✅ corrected & flagged, numerically demonstrated |
| 17 | Ramp e_ss=∞; sketch r(t) vs y(t) diverging | example (prof) / graph | same; Ex2Ramp | ✅ solved; graph reproduced; explained why 2ξ/ω_n does not apply |

Additional teaching examples: 6 (overdamped ξ=1.25, ω_n=4; critical ω_n=3; underdamped ξ=0.6, ω_n=5 with numeric complex residues; non-unity DC gain 18/(s²+3s+9); open-loop 16/(s(s+4)) → T and ramp error; common mistakes on Example 2) · Exercises: 23
Interactive widgets: SecondOrderExplorer (ξ, ω_n sliders → s-plane poles, case name, formulas used, α/ω/θ/roots/e_ss read-out, impulse/step/ramp plots); static families for ξ=0.25/1/2; Example 2 plots; ramp-phase numerical check; limit plots (ξ→0, ξ→1).
Uncertain items: none in the handwriting. Physical analogues (mass-spring-damper, series RLC) and the IVT initial-slope argument are clarifying material, not in the notes.


## Module 08 — 08 Baskın Kutuplar ve Matematiksel Tanımlar.pdf

| Page | Item | Type | Website location | Status |
|---|---|---|---|---|
| 1 | Yüksek dereceden kontrol sistemleri: many poles, partial fractions, sum of independent solutions | topic | § Higher-order systems (Def box) | ✅ explained |
| 1 | Each pole creates its own time constant (τ = 1/\|Re p\|) | formula | § Each pole has its own time constant | ✅ explained |
| 1 | Poles near −∞ decay fast; poles near 0 decay slowly; Re p > 0 → unstable output | remark | § Each pole… (table), § Stability from the sign of the real part | ✅ explained |
| 1 | Slip: "zaman sabiti düşük" for poles near 0 (should be "yüksek") | correction | § Each pole… → Note "Correction to the notes (p. 1)"; exercise "Spot the slip on page 1" | ✅ corrected & flagged |
| 1 | Dominant pole = component of the rightmost pole is most dominant | definition | § Dominant poles (Def "Dominant poles") | ✅ explained |
| 1 | "−∞'a yakın" partly scribbled | remark | read as −∞ (context-confirmed), used in table | ✅ incorporated |
| 2 | Example T = 10/((s+10)(s+1)): poles, y(t)=1−(10/9)e^{-t}+(1/9)e^{-10t}, τ=1 and τ=0.1 | example (prof) | § Dominant poles → Example "Dominant pole of 10/((s+10)(s+1))" | ✅ solved & verified |
| 2 | Numerical comparison e^{-0.5}=0.6065 vs e^{-5}=0.00674 | example (prof) | same example, step "Numerical comparison"; DominantTermsPlot; exercise "The professor's comparison at t = 1 s" | ✅ verified |
| 2 | Slip: e^{10t} missing minus sign | correction | Note "Correction to the notes (p. 2)" | ✅ corrected & flagged |
| 2 | Slip: "zaman sabiti yüksek olan s2" (s2 has the small τ) | correction | Note "Correction to the notes (p. 2)" | ✅ corrected & flagged |
| 2 | Far roots → large denominator → small partial-fraction coefficients, esp. high degree | remark | § Why far poles have small coefficients (general residue formula) | ✅ explained |
| 2 | (added) full response vs dominant-pole approximations plot | graph | DominantExamplePlot | ✅ reconstructed |
| 3 | Sistem sıfırının etkisi: T=25/(s²+6s+25) step response | example (prof) | § The three step responses → Example "A zero at -25 and at -5 added to 25/(s^2+6s+25)" | ✅ solved & verified |
| 3 | Coefficient 0.6 in y(t) is wrong → 0.75 | correction | Note "Correction to the notes (p. 3): the coefficient is 0.75, not 0.6" (4 independent checks) | ✅ corrected & flagged |
| 3 | Zero at −25: y1(t)=1−0.5e^{-3t}sin4t−e^{-3t}cos4t | example (prof) | same example, step "Zero at s = −25" | ✅ solved & verified |
| 3–4 | Zero moved to −5 keeping steady-state gain: y2(t)=1+0.5e^{-3t}sin4t−e^{-3t}cos4t | example (prof) | same example, step "Zero at s = −5" | ✅ solved & verified |
| 4 | Fig: three step responses y, y1, y2 | graph | ZeroEffectPlot (exact functions) + explanation; exercise "Ordering the curves of the zero figure" | ✅ reconstructed |
| 4 | Conclusion: far zero negligible, zero near dominant poles has larger effect | remark | § Why a nearby zero increases overshoot (y_z = y + (1/z)ẏ), ZeroExplorer | ✅ explained |
| 5 | Kontrol kriterlerinin matematiksel tanımı: underdamped 2nd-order response shows all criteria | topic | § Mathematical definition of the control criteria | ✅ explained |
| 5 | y(t)=1−e^{-αt}[cos ωt + ξ/√(1−ξ²) sin ωt] | formula | § The underdamped response (KeyFormula + compact sin(ωt+θ) form) | ✅ explained |
| 5 | Fig: generic response with y_ss=1, m, t_r, t_p, t_s | graph | CriteriaSketchPlot (ξ=0.4, ωn=1, ±2% band) | ✅ reconstructed |
| 6 | Rise time derivation: y(t_r)=1 → tan ωt_r = −√(1−ξ²)/ξ = −ω/α | derivation | § Rise time | ✅ explained |
| 6 | t_r = (1/ω)tan⁻¹(−ω/α) = (π − cos⁻¹ξ)/ω; angle of conjugate root | formula | § Rise time (branch choice, PoleAngleFigure, cross-check) | ✅ explained |
| 7 | Maximum overshoot definition m, %m (oransal) | definition | § Maximum overshoot (Def) | ✅ explained |
| 7 | dy/dt = 0 derivation, cos terms cancel since α = ξω/√(1−ξ²) | derivation | § Peak time | ✅ explained |
| 7 | Slip: e^{αt_p} should be e^{-αt_p}; unclear "=" stroke | correction | Note "Correction to the notes (p. 7)" | ✅ corrected & flagged |
| 7 | (ωn/√(1−ξ²))e^{-αt}sin ωt = 0 → ωt_p = 0, π, 2π…; t_p = π/ω | formula | § Peak time (KeyFormula, PeakDerivativePlot) | ✅ explained |
| 8 | y(t_p) = 1 − e^{…} sign slip (should be 1 +) | correction | Note "Correction to the notes (p. 8)" | ✅ corrected & flagged |
| 8 | m = e^{-ξωnπ/ω} = e^{-ξπ/√(1−ξ²)} | formula | § Maximum overshoot (KeyFormula) | ✅ explained |
| 8 | Settling time t_s = 4τ = 4/(ξωn) (2%), sometimes 5τ; 3τ = 3/(ξωn) (5%) | formula | § Settling time (envelope derivation, approximation note, EnvelopePlot) | ✅ explained |
| 9 | Example: find transient parameters; block diagram R, Σ(+,−), E, G=70/(s²+12s+30), Y, unity feedback | diagram | § Worked example: unity feedback (ExampleBD) | ✅ reconstructed |
| 9 | T = 70/(s²+12s+100) = 0.7·10²/(s²+2·10·0.6s+10²); roots −6±j8; ξ=0.6, ωn=10 | example (prof) | Example "Transient parameters of G = 70/(s^2+12s+30) with unity feedback" | ✅ solved & verified |
| 9 | θ = 53.13°; t_p = 0.39; %m = 9.47 (exact 9.478); y(t_p) = 0.766 | example (prof) | same example | ✅ solved & verified |
| 9 | Slips: "α=−6" sign convention, "√(1−3,6)", missing "/" in %m exponent | correction | Note "Corrections to the notes (p. 9)" | ✅ corrected & flagged |
| 10 | t_r = 0.276 s (exact 0.2768), t_s = 0.667 s | example (prof) | same example | ✅ solved & verified |
| 10 | Fig: response with levels 0.7, 0.766, t axis 0.2–0.8 | graph | ExampleResponsePlot (exact function, note on zero initial slope) + exam sketch tip | ✅ reconstructed |

Additional teaching examples: 7 (third-order with far pole; extra pole not far enough; zero at −10; criteria for ξ=0.5, ωn=4; working backwards from %m and t_s; gain for required ξ; common mistakes) · Exercises: 17
Interactive widgets: CriteriaExplorer (ξ, ωn, band → curve with t_r, t_p, t_s, m + s-plane with θ + readout incl. measured t_s), FarPoleExplorer, ZeroExplorer.
Uncertain items: p.1 "−∞" scribble (read as −∞); p.7 "=" with extra stroke (read as "="); p.4 sketch ordering of y and y1 is qualitative (exact curves used). The 5× dominance rule is presented explicitly as a rule of thumb, not from the notes.


## Final comparison against the deployed website

Checked after deployment (see "Verification" below):

- All 8 lesson routes exist (`#/m/01` … `#/m/08`) and each renders its full content; no module is a stub, no placeholder text exists (`grep -ri "coming soon\|TODO\|placeholder"` over `src/lessons` returns nothing).
- Every ✅ row above corresponds to a section, figure, example or exercise present in the built lesson; every `formulas.ts` `section`/`example` anchor and every cross-lesson link resolves (`node scripts/check-links.mjs`).
- All LaTeX compiles without KaTeX errors (`node scripts/check-katex.mjs src/lessons/mNN`; zero `katex-error` nodes in the production bundle).
- **Missing content: none identified.** Items that could not be read with full certainty are listed in each module's "Uncertain items" line above and are shown on the site inside "Unclear in the handwritten notes" boxes.

### Verification
- `npm run build` succeeds (TypeScript strict + Vite).
- Numerical results in examples/exercises were checked independently by the authors (partial fractions recombined at several s values, responses checked against IVT/FVT and against RK4 ODE simulations for Modules 07/08).
