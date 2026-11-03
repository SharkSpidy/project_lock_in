// Lock-In Plan data: 2 Nov 2026 to 15 Feb 2027. All times IST.
const PLAN_START = "2026-11-02", PLAN_END = "2027-02-15";

const EXAMS = {
  "2026-11-09": ["Compiler Lab", "S7"],
  "2026-11-23": ["Artificial Intelligence", "S7"],
  "2026-11-25": ["Cloud Computing", "S7"],
  "2026-11-27": ["Electronic Hardware for Engineers", "S7"],
  "2026-11-30": ["Industrial Safety for Engineers", "S7"],
  "2026-12-11": ["Compiler Design", "S6"],
  "2026-12-16": ["Algorithm Analysis and Design", "S6"],
  "2027-01-11": ["Computer Networks", "S5"],
  "2027-01-15": ["Microprocessors and Microcontrollers", "S5"],
  "2027-02-04": ["Computer Organization and Architecture", "S4"],
  "2027-02-08": ["Operating Systems (CST 206)", "S4"],
  "2027-02-15": ["Operating Systems (tentative)", "S4"]
};

// Daily routine. alarm:true = loud wake/sleep/gym style alarm. kind drives icons/colors.
const ROUTINE = [
  { t: "06:00", end: "06:30", k: "life", title: "Wake, water, light", desc: "500 ml water, 10-min daylight walk, 5-min stretch. Banana (~110 kcal).", alarm: true },
  { t: "06:30", end: "08:30", k: "A", title: "Block A: deep work", desc: "2 Pomodoro cycles (50/10). Hardest new material of the primary subject." },
  { t: "08:30", end: "09:15", k: "meal", title: "Breakfast", desc: "meal:breakfast" },
  { t: "09:15", end: "12:15", k: "B", title: "Block B: deep work", desc: "3 cycles. Continue the module, then problems and handwritten answers." },
  { t: "12:15", end: "12:30", k: "life", title: "Walk", desc: "Short walk outside." },
  { t: "12:30", end: "13:15", k: "meal", title: "Lunch: Kerala meals (~780 kcal)", desc: "Matta rice 1.5 cups, sambar/parippu, fish curry or egg roast, thoran, moru, pappadam." },
  { t: "13:15", end: "14:00", k: "life", title: "Rest", desc: "20-min nap, then 25 min rest. No study, no scrolling." },
  { t: "14:00", end: "16:30", k: "C", title: "Block C: secondary subject", desc: "2 cycles, then 30 min light work: flashcards, formula sheet, mistake notebook." },
  { t: "16:30", end: "16:45", k: "meal", title: "Tea snack (~250 kcal)", desc: "Tea + nendran banana / sundal / unniyappam. Change for gym." },
  { t: "17:00", end: "18:15", k: "gym", title: "Gym", desc: "gym:today", alarm: true },
  { t: "18:15", end: "19:00", k: "life", title: "Shower and wind-down", desc: "Shower, music, family time." },
  { t: "19:00", end: "19:45", k: "meal", title: "Dinner", desc: "meal:dinner" },
  { t: "20:00", end: "21:30", k: "D", title: "Block D: PYQs and recall", desc: "PYQ practice, then closed-book recall of the last 3 days." },
  { t: "21:30", end: "22:00", k: "life", title: "Daily wrap-up", desc: "Tick off goals, write tomorrow's 4 block goals, pack the desk." },
  { t: "22:00", end: "22:30", k: "meal", title: "Wind-down + warm milk (~120 kcal)", desc: "Screens off. Warm milk with turmeric, reading, lights low." },
  { t: "22:30", end: "06:00", k: "sleep", title: "SLEEP", desc: "7.5 hours. Phone charges outside the bedroom.", alarm: true }
];

// Recovery schedule for the late start on 3 Nov 2026. Later plans absorb the deferred work.
const DAY_SCHEDULES = {
  "2026-11-03": [
    { id: 100, t: "12:00", end: "12:30", k: "meal", title: "Lunch and reset", body: "Eat, drink water, and set up the desk. Start fresh at 12:30." },
    { id: 101, t: "12:30", end: "14:15", k: "A", title: "Compiler Lab: LEX setup and programs Q1-2", body: "Get the LEX environment working, then complete and test Q1-2.", alarm: true },
    { id: 102, t: "14:15", end: "14:30", k: "life", title: "Break", body: "Step away from the screen and stretch." },
    { id: 103, t: "14:30", end: "16:00", k: "B", title: "Compiler Lab: LEX programs Q3-5", body: "Finish Q3-5, then run the LEX programs completed today.", alarm: true },
    { id: 104, t: "16:00", end: "16:30", k: "meal", title: "Tea and snack", body: "Have a snack and take a proper break." },
    { id: 105, t: "16:30", end: "17:30", k: "C", title: "AI M1: agents and environments", body: "Cover agent types, rationality, and task environments. Make a short recall sheet.", alarm: true },
    { id: 106, t: "17:30", end: "18:00", k: "life", title: "Walk and reset", body: "Easy walk or stretch; skip the gym today." },
    { id: 107, t: "18:00", end: "19:00", k: "D", title: "YACC: set up and start Q6", body: "Get YACC compiling and outline the expression grammar. Finish Q6 and complete Q7-9 tomorrow.", alarm: true },
    { id: 108, t: "19:00", end: "19:45", k: "meal", title: "Dinner", body: "Eat dinner away from the desk." },
    { id: 109, t: "20:00", end: "20:45", k: "life", title: "Short recall and tomorrow setup", body: "Recall the LEX programs without notes, write down blockers, and prepare the YACC tasks for tomorrow." },
    { id: 110, t: "22:00", end: "22:30", k: "life", title: "Wind-down", body: "Screens off, get ready for bed, and keep the normal sleep time." },
    { id: 111, t: "22:30", end: "06:00", k: "sleep", title: "SLEEP", body: "Keep the normal sleep schedule.", alarm: true }
  ]
};

const GYM = ["Sun: 30-min walk + mobility only", "Mon: Push (chest, shoulders, triceps)", "Tue: Pull (back, biceps)", "Wed: Legs", "Thu: 35 min easy cardio + core", "Fri: Upper body", "Sat: Lower body"];

// Meals by weekday index (0=Sun). [name, kcal]
const BREAKFAST = [
  ["Kappa (1 cup) + fish curry (1 piece)", 600],
  ["Puttu (2 slices) + kadala curry (3/4 cup) + 1 banana", 570],
  ["3 dosa + sambar (1 cup) + coconut chutney", 550],
  ["3 appam + egg curry (1 egg)", 520],
  ["4 idli + sambar + chutney + 1 boiled egg", 500],
  ["Puttu + cherupayar curry + 1 banana", 540],
  ["3 idiyappam + vegetable stew (1 cup) + 1 boiled egg", 560]
];
const DINNER = [
  ["Light: 2 chapati + dal curry + thoran", 550],
  ["2 chapati + chicken curry (150 g) + thoran", 650],
  ["Rice (1 cup) + fish curry + thoran + moru", 600],
  ["2 dosa + sambar + 2-egg omelette", 650],
  ["2 chapati + egg curry (2 eggs)", 640],
  ["Rice (1 cup) + sambar + beef/chicken fry (small) + salad", 700],
  ["3 appam + vegetable stew", 600]
];
const LUNCH_TABLE = [["Matta rice (1.5 cups cooked)", 330], ["Sambar or parippu (3/4 cup)", 110], ["Fish curry or egg roast", 150], ["Thoran (1/2 cup)", 90], ["Moru or curd (1/2 cup)", 40], ["Pappadam (1)", 60]];
const SNACKS = [["Tea with milk + steamed nendran banana", 250], ["Chai + kadala sundal (1/2 cup)", 240], ["Tea + 2 unniyappam", 260], ["Tea + pazhampori (1)", 280]];

// Per-day study plan: "YYYY-MM-DD": [Blocks A+B, Block C, Block D]. Empty string = free.
const PLAN = {
"2026-11-02": ["Lab: LEX setup, lexical analyzer in C, LEX programs Q1-5 (line/word count, abc to ABC, vowels)", "AI M1: agents, rationality, environments", "Rewrite 2 LEX programs from memory"],
"2026-11-03": ["Recovery: Compiler Lab LEX setup and Q1-5; start YACC Q6", "AI M1: agents, rationality, environments (recovery)", "Recall LEX and prepare to finish Q6 and do YACC Q7-9 tomorrow"],
"2026-11-04": ["Lab: finish YACC Q6 and complete Q7-9 (expression grammar, identifier, calculator, AST)", "AI M2: uninformed search (BFS, DFS, UCS, IDDFS)", "Rewrite the YACC calculator"],
"2026-11-05": ["Lab: NFA/DFA Q10-13 (epsilon-closure, e-NFA to NFA, NFA to DFA, DFA minimization)", "AI M2: informed search, A*, heuristics; M3: minimax and alpha-beta", "Rewrite NFA to DFA"],
"2026-11-06": ["Lab: FIRST/FOLLOW, recursive descent, shift-reduce (Q14-16)", "AI M3: CSP, backtracking, constraint propagation", "Rewrite FIRST/FOLLOW"],
"2026-11-07": ["Lab: constant propagation, intermediate code, 8086 back end (Q17-19)", "AI M4: propositional logic", "Rewrite ICG and update the fair record"],
"2026-11-08": ["Lab mock 1 + 2: 3 random programs each in 90 min; fix errors and finish the fair record", "Redo the 2 weakest programs", ""],
"2026-11-09": ["EXAM: Compiler Lab. Skim algorithms for 1 hour first. Bring the fair record. Rest after.", "", "AI M4 skim (1 hour)"],
"2026-11-10": ["AI M4: first-order logic, syntax, using FOL, knowledge representation", "Cloud M1: paradigms, NIST model, IaaS/PaaS/SaaS, deployment models", "ISE M1"],
"2026-11-11": ["AI M4: unification, forward/backward chaining, resolution proofs", "Cloud M2: virtualization, hypervisors, Xen, VMware", "ISE M2"],
"2026-11-12": ["AI M5: supervised learning, decision trees, regression, classification", "Cloud M3: data centers, OpenStack, MapReduce, Hadoop, Spark", "ISE M3"],
"2026-11-13": ["AI PYQ paper 1, timed 3 hours, then correct it", "Cloud M4: security threats, VM security, IAM", "ISE M4"],
"2026-11-14": ["AI PYQ paper 2 and weak topics (alpha-beta, A*, resolution)", "Cloud M5: AWS, GCP, Azure services", "ISE M5, then weekly mock"],
"2026-11-15": ["Cloud: rapid pass of M1-M3 (4 hours). Stop at 11:30.", "", ""],
"2026-11-16": ["Cloud M4, M5 revision, then Cloud PYQ 1", "EHE M1 (get the syllabus first)", "AI one-page notes"],
"2026-11-17": ["Cloud PYQ 2, comparison tables (AWS vs GCP vs Azure)", "EHE M2", "AI short-answer recall"],
"2026-11-18": ["AI full revision, all 5 modules", "EHE M3", "Cloud recall"],
"2026-11-19": ["AI PYQ 3, timed, then correct it", "EHE M4", "ISE recall"],
"2026-11-20": ["Cloud PYQ 3 and definitions", "EHE M5", "AI algorithm sheet"],
"2026-11-21": ["AI final drills: alpha-beta, A*, resolution, decision tree", "EHE PYQs", "Cloud recall + ISE PYQ"],
"2026-11-22": ["AI light revision, 3 hours. Stop at 11:30.", "", ""],
"2026-11-23": ["EXAM: Artificial Intelligence. Skim 90 min before it. Afternoon: rest.", "Cloud revision (2 hours)", "ISE M1-M3 recall"],
"2026-11-24": ["Cloud final revision and PYQ", "EHE revision", "ISE recall"],
"2026-11-25": ["EXAM: Cloud Computing. Skim 90 min before it.", "EHE M1-M3 recall", "EHE PYQ"],
"2026-11-26": ["EHE full revision and PYQs", "EHE PYQ", "ISE recall"],
"2026-11-27": ["EXAM: Electronic Hardware for Engineers. Skim 90 min before it.", "ISE M1-M3", "ISE M4, M5"],
"2026-11-28": ["ISE PYQs, 2 papers", "ISE definitions, PPE list, fire classes", "ISE recall"],
"2026-11-29": ["ISE final skim, 3 hours. Stop at 11:30.", "", ""],
"2026-11-30": ["EXAM: Industrial Safety for Engineers.", "", ""],
"2026-12-01": ["Reset half day: sleep normally, collect CD and AD PYQs, skim CD M1 (3 hours).", "", ""],
"2026-12-02": ["CD M1: phases of a compiler, lexical analysis, tokens, input buffering", "AD M1: asymptotic notations, recurrences, master theorem", "Recall LEX (link to lab)"],
"2026-12-03": ["CD M2: CFG, ambiguity, left recursion, left factoring, FIRST/FOLLOW", "AD M1: complexity of loops and recursion", "FIRST/FOLLOW drills"],
"2026-12-04": ["CD M2: LL(1), predictive and recursive descent parsing, error handling", "AD M2: AVL trees, rotations", "LL(1) table drills"],
"2026-12-05": ["CD M3: handle pruning, shift-reduce, operator precedence, LR(0) and SLR", "AD M2: disjoint sets, graph algorithms", "Weekly mock: CD M1, M2"],
"2026-12-06": ["CD M3: canonical LR and LALR tables (4 hours). Stop at 11:30.", "", ""],
"2026-12-07": ["CD M4: syntax-directed definitions, S/L-attributed, run-time environments", "AD M3: divide and conquer (merge sort, quick sort, Strassen)", "CD M3 table drills"],
"2026-12-08": ["CD M4: intermediate code (three-address, quadruples); CD M5: optimization", "AD M3: greedy (knapsack, MST, Dijkstra)", "AD recall"],
"2026-12-09": ["CD M5: code generation, then CD PYQ 1 (timed)", "AD M4: dynamic programming (matrix chain, Floyd-Warshall)", "CD recall"],
"2026-12-10": ["CD PYQ 2 and weak topics (LR tables, FIRST/FOLLOW)", "AD M4: N-Queens, branch and bound (TSP)", "Light recall. In bed by 22:00."],
"2026-12-11": ["EXAM: Compiler Design. Skim 90 min before it.", "AD M1, M2 recall", ""],
"2026-12-12": ["AD M4: DP, backtracking, B&B problems", "AD M5: P, NP, NP-hard, NP-complete", "AD recall"],
"2026-12-13": ["AD M5: Clique and Vertex Cover proofs, approximation, randomized quick sort (4 hours). Stop at 11:30.", "", ""],
"2026-12-14": ["AD PYQ 1 and M1-M3 revision", "AD M4 recall", "Short answers"],
"2026-12-15": ["AD PYQ 2 and weak topics", "AD M5 recall", "Light recall. In bed by 22:00."],
"2026-12-16": ["EXAM: Algorithm Analysis and Design.", "", ""],
"2026-12-17": ["FULL REST DAY after back-to-back exams.", "", ""],
"2026-12-18": ["Planning: gather PYQs, skim CN M1 (4 hours).", "", ""],
"2026-12-19": ["CN M1: uses of networks, OSI and TCP/IP models, transmission media, switching", "", "CN recall"],
"2026-12-20": ["CN M1: numericals (4 hours). Stop at 11:30.", "", ""],
"2026-12-21": ["CN M2: framing, error detection (CRC, Hamming), sliding window", "MP M1: 8085 and 8086 architecture", "CRC and Hamming drills"],
"2026-12-22": ["CN M2: HDLC, MAC, ALOHA, CSMA, Ethernet, WLAN", "MP M1: 8086 signals, min/max mode, timing", "MAC recall"],
"2026-12-23": ["CN M3: routing (distance vector, link state), congestion control, QoS", "MP M2: addressing modes, instruction set", "Routing drills"],
"2026-12-24": ["CN M3: multicast, mobile routing, finish M3", "MP M2: assembly programs", "Program practice"],
"2026-12-25": ["FULL REST DAY.", "", ""],
"2026-12-26": ["CN M4: IP addressing, subnetting, CIDR numericals", "MP M2: assembly programs (sorting, string ops)", "Weekly mock: CN M1-M3"],
"2026-12-27": ["CN M4: ICMP, ARP, DHCP, OSPF, BGP, IPv6 (4 hours). Stop at 11:30.", "", ""],
"2026-12-28": ["CN M5: UDP, TCP, flow and congestion control", "MP M3: stack structure, programming with the stack", "Subnetting drills"],
"2026-12-29": ["CN M5: DNS, SMTP, HTTP, application layer", "MP M3: interrupts, ISRs, interrupt programming", "TCP recall"],
"2026-12-30": ["CN PYQ 1 and M1, M2 revision", "MP M4: 8255 PPI, modes", "Weak topics"],
"2026-12-31": ["CN PYQ 2 and numerical drills", "MP M4: 8254 timer, 8257 DMA", "Short answers. In bed by 22:30."],
"2027-01-01": ["Half day: MP M5: 8051 architecture, instruction set (4 hours). Stop at 11:30.", "", ""],
"2027-01-02": ["CN M3, M4 revision, subnetting drill", "MP M5: 8051 programs", "Weekly mock: MP M1-M3"],
"2027-01-03": ["MP M5 programs and full first-pass check (4 hours). Stop at 11:30.", "", ""],
"2027-01-04": ["CN revision pass: PYQ 3", "MP revision: M1-M3", "CN short answers"],
"2027-01-05": ["CN revision pass: PYQ 4", "MP PYQ 1", "MP short answers"],
"2027-01-06": ["CN revision pass: M3-M5", "MP M4, M5 and PYQ 2", "CN short answers"],
"2027-01-07": ["CN formula sheet and PYQ", "MP program drill", "MP short answers"],
"2027-01-08": ["CN last full pass", "MP PYQ 3", "CN short answers"],
"2027-01-09": ["CN light recap, 3 hours", "MP M1, M2", ""],
"2027-01-10": ["CN final skim, 3 hours. Stop at 11:30.", "", ""],
"2027-01-11": ["EXAM: Computer Networks. Skim 90 min before it.", "MP M1-M3 (3 hours after rest)", ""],
"2027-01-12": ["MP M1-M3 rapid pass and program drill", "MP PYQ", "MP recall"],
"2027-01-13": ["MP M4, M5 and PYQ papers", "MP programs", "COA M1 skim (30 min)"],
"2027-01-14": ["MP final light revision. In bed by 22:00.", "", ""],
"2027-01-15": ["EXAM: Microprocessors and Microcontrollers. Rest in the afternoon.", "", ""],
"2027-01-16": ["Reset half day: collect PYQs, skim COA M1 (3 hours).", "", ""],
"2027-01-17": ["COA M1: functional units, bus structures, addressing, performance (4 hours). Stop at 11:30.", "", ""],
"2027-01-18": ["COA M2: register transfer, arithmetic micro-operations, ALU design", "OS M1: OS operations, system calls", "COA M1 recall"],
"2027-01-19": ["COA M2: bus and memory transfer, shifter, status register", "OS M2: processes, PCB, threads, IPC", "COA M2 drills"],
"2027-01-20": ["COA M3: Booth multiplication, restoring and non-restoring division, floating point", "OS M2: scheduling (FCFS, SJF, RR, priority numericals)", "Scheduling drills"],
"2027-01-21": ["COA M3: pipelining and hazards", "OS M3: critical section, Peterson, semaphores, monitors", "Arithmetic drills"],
"2027-01-22": ["COA M4: control logic, hardwired and microprogrammed", "OS M3: producer-consumer, dining philosophers, readers-writers", "COA M4 recall"],
"2027-01-23": ["COA M4: control logic design problems", "OS M3: deadlock detection, avoidance, Banker's algorithm", "Weekly mock: COA M1-M3"],
"2027-01-24": ["COA M5: instruction execution, interrupts, I/O (4 hours). Stop at 11:30.", "", ""],
"2027-01-25": ["COA M5: DMA, cache mapping, memory hierarchy", "OS M4: address spaces, swapping, paging, segmentation", "Cache numericals"],
"2027-01-26": ["Half day (Republic Day): COA memory and cache numericals (4 hours).", "", ""],
"2027-01-27": ["COA M5 finish: virtual memory, I/O organization", "OS M4: demand paging, page replacement (FIFO, LRU, optimal)", "Page replacement drills"],
"2027-01-28": ["COA PYQ 1, module-wise", "OS M5: file concept, directories, allocation, disk scheduling", "OS M5 recall"],
"2027-01-29": ["COA PYQ 2 and weak topics", "OS PYQ: M1, M2", "Short answers"],
"2027-01-30": ["COA full timed mock", "OS M3 numericals", "Weekly mock: OS M1-M3"],
"2027-01-31": ["COA M1-M3 revision (4 hours). Stop at 11:30.", "", ""],
"2027-02-01": ["COA M4, M5 revision and PYQ 3", "OS M4, M5 revision", "COA recall"],
"2027-02-02": ["COA PYQ 4 and formula sheet", "OS PYQ", "Light recall"],
"2027-02-03": ["COA final light revision. In bed by 22:00.", "", ""],
"2027-02-04": ["EXAM: Computer Organization and Architecture. Skim 90 min before it.", "OS M3 revision (3 hours after rest)", ""],
"2027-02-05": ["OS M1, M2 revision and scheduling numericals", "OS M3: synchronization, deadlock", "OS PYQ"],
"2027-02-06": ["OS M3, M4 numericals (Banker's, page replacement) and a full mock", "OS M5", "Weekly mock"],
"2027-02-07": ["OS M5 and final skim (4 hours). Stop at 11:30.", "", ""],
"2027-02-08": ["EXAM: Operating Systems. Rest in the afternoon.", "", ""],
"2027-02-09": ["FULL REST DAY.", "", ""],
"2027-02-10": ["Buffer for tentative 15 Feb OS paper: 2 PYQ papers, then fix weak topics", "OS numerical drills", "Short answers"],
"2027-02-11": ["Buffer: 2 OS PYQ papers, then fix weak topics", "OS numerical drills", "Short answers"],
"2027-02-12": ["Buffer: 2 OS PYQ papers, then fix weak topics", "OS numerical drills", "Short answers"],
"2027-02-13": ["Buffer: 2 OS PYQ papers, then fix weak topics", "OS numerical drills", "Short answers"],
"2027-02-14": ["Light skim, 3 hours. Stop at 11:30.", "", ""],
"2027-02-15": ["EXAM (tentative): Operating Systems. If cancelled, treat 10-14 Feb as rest.", "", ""]
};

// Module lists per subject (from the KTU 2019 syllabus files). EHE is editable in the app.
const SYLLABUS = {
  "Compiler Lab": ["LEX lexical analyzer", "YACC syntax analyzer", "NFA / DFA problems", "Top-down parser", "Bottom-up parser", "Code optimization simulation", "Intermediate code generation", "Back end (8086 assembly)"],
  "Artificial Intelligence": ["M1 Introduction, agents", "M2 Problem solving by search", "M3 Adversarial search, CSP", "M4 Logic, FOL, inference", "M5 Machine learning"],
  "Cloud Computing": ["M1 Fundamental cloud computing", "M2 Virtualization", "M3 Enabling tech, private cloud, programming", "M4 Cloud security", "M5 AWS, GCP, Azure"],
  "Industrial Safety for Engineers": ["M1 Safety introduction", "M2 Personal protection", "M3 Safety in construction", "M4 Hazards in machines", "M5 Hazard identification and analysis"],
  "Compiler Design": ["M1 Intro and lexical analysis", "M2 Syntax analysis", "M3 Bottom-up parsing", "M4 SDT and intermediate code", "M5 Optimization and code generation"],
  "Algorithm Analysis and Design": ["M1 Algorithm analysis", "M2 Advanced data structures, graphs", "M3 Divide and conquer, greedy", "M4 DP, backtracking, B&B", "M5 Complexity theory"],
  "Computer Networks": ["M1 Introduction, physical layer", "M2 Data link layer", "M3 Network layer", "M4 Network layer in the Internet", "M5 Transport and application layer"],
  "Microprocessors and Microcontrollers": ["M1 Evolution, 8086 architecture", "M2 Addressing modes, instructions", "M3 Stack and interrupts", "M4 Interfacing chips", "M5 8051 microcontroller"],
  "Computer Organization and Architecture": ["M1 Basic structure of computers", "M2 Register transfer, processor logic", "M3 Arithmetic algorithms, pipelining", "M4 Control logic design", "M5 Processing units, I/O, memory"],
  "Operating Systems (CST 206)": ["M1 Introduction", "M2 Processes and scheduling", "M3 Synchronization and deadlocks", "M4 Memory management", "M5 File and disk management"],
  "Electronic Hardware for Engineers": ["Module 1 (edit me)", "Module 2 (edit me)", "Module 3 (edit me)", "Module 4 (edit me)", "Module 5 (edit me)"]
};
