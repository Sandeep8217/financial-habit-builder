import {useState} from "react";
import {Link} from "react-router-dom";
import {
    Wallet, ArrowRight, Play, TrendingUp, TrendingDown,
    Target, PiggyBank, Heart, ShieldCheck, BarChart3,
    Smartphone, CheckCircle2, Menu, X, ChevronDown,
    IndianRupee, CreditCard, Sparkles, CalendarDays,
    LockKeyhole, ChartNoAxesCombined, CircleHelp,
    Globe,
} from "lucide-react";

const features = [
    {
        icon: CreditCard,
        title: "Smart Transaction Tracking",
        description: "Record your income and expenses in one place. Always know where your money goes.",
        color: "bg-blue-50 text-blue-600",
    },
    {
        icon: Wallet,
        title: "Monthly Budget Planning",
        description: "Set monthly spending limits and stay on track with clear budget progress.",
        color: "bg-emerald-50 text-emerald-600",
    },
    {
        icon: Target,
        title: "Savings Goals",
        description: "Turn your dreams into achievable targets and watch your savings grow.",
        color: "bg-violet-50 text-violet-600",
    },
    {
        icon: Heart,
        title: "Build Better Habits",
        description: "Create daily financial habits, maintain streaks and earn experience points.",
        color: "bg-rose-50 text-rose-600",
    },
    {
        icon: TrendingUp,
        title: "Track Your Wealth",
        description: "Track assets, liabilities and understand your overall net worth.",
        color: "bg-teal-50 text-teal-600",
    },
    {
        icon: BarChart3,
        title: "Visual Analytics",
        description: "Understand your financial patterns through simple charts and insights.",
        color: "bg-amber-50 text-amber-600",
    },
    {
        icon: CalendarDays,
        title: "Financial Planning",
        description: "Bring your monthly finances, budgets and goals together.",
        color: "bg-indigo-50 text-indigo-600",
    },
    {
        icon: ShieldCheck,
        title: "Your Data, Your Control",
        description: "Manage your financial records with account-based access and privacy.",
        color: "bg-green-50 text-green-600",
    },
];

const steps = [
    {
        number: "01",
        icon: Wallet,
        title: "Create your account",
        description: "Get started with your personal WealthWise account in just a few moments.",
    },
    {
        number: "02",
        icon: CreditCard,
        title: "Track your money",
        description: "Add your income and expenses to understand your spending patterns.",
    },
    {
        number: "03",
        icon: Target,
        title: "Set goals and habits",
        description: "Create savings targets, plan budgets and build positive habits.",
    },
    {
        number: "04",
        icon: ChartNoAxesCombined,
        title: "Grow your wealth",
        description: "Monitor your progress and make more informed financial decisions.",
    },
];

const trustItems = [
    {
        icon: LockKeyhole,
        title: "Account-based access",
        description: "Your financial records are associated with your account.",
    },
    {
        icon: ShieldCheck,
        title: "Private financial records",
        description: "Your personal financial data is separated from other users.",
    },
    {
        icon: IndianRupee,
        title: "Made for INR tracking",
        description: "Simple Indian currency formatting for everyday money management.",
    },
    {
        icon: Smartphone,
        title: "Access anywhere",
        description: "Use the responsive experience across desktop, tablet and mobile.",
    },
];

const showcase = [
    {
        title: "Your Financial Dashboard",
        description: "Get a complete picture of your financial activity.",
        icon: BarChart3,
        color: "from-emerald-500 to-teal-600",
        preview: "dashboard",
    },
    {
        title: "Manage Transactions",
        description: "Keep income and expenses organised.",
        icon: CreditCard,
        color: "from-blue-500 to-indigo-600",
        preview: "transactions",
    },
    {
        title: "Plan Your Budgets",
        description: "Keep monthly spending under control.",
        icon: Wallet,
        color: "from-violet-500 to-purple-600",
        preview: "budgets",
    },
    {
        title: "Achieve Savings Goals",
        description: "See your progress as you save.",
        icon: Target,
        color: "from-orange-500 to-rose-500",
        preview: "goals",
    },
];

const faqs = [
    {
        question: "What is WealthWise?",
        answer: "WealthWise is a personal finance management application that helps you track transactions, manage budgets, set savings goals, build habits and monitor your net worth.",
    },
    {
        question: "Is WealthWise free to use?",
        answer: "WealthWise is presented as a free portfolio-project application. Its availability and hosting depend on the deployed demo environment.",
    },
    {
        question: "Does WealthWise connect to my bank account?",
        answer: "No. Transactions are entered manually. WealthWise does not automatically connect to your bank account.",
    },
    {
        question: "Can I track my savings and liabilities?",
        answer: "Yes. You can create savings goals, record contributions, track assets and liabilities, and view your calculated net worth.",
    },
    {
        question: "Is my financial information visible to other users?",
        answer: "The application uses account-based authentication and user-specific data access. Each user's financial records are scoped to their account.",
    },
    {
        question: "Can I use WealthWise on my phone?",
        answer: "Yes. The frontend is designed to adapt to desktop, tablet and mobile screen sizes.",
    },
];

function Brand({light = false}) {
    return (
        <Link to="/" className="flex items-center gap-2.5">
            <span
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500 text-white shadow-lg shadow-emerald-500/20">
                <Wallet size={22}/>
            </span>
            <span className={`text-xl font-extrabold tracking-tight ${light ? "text-white" : "text-slate-900"}`}>
                Wealth<span className="text-emerald-500">Wise</span>
            </span>
        </Link>
    );
}

function DashboardPreview() {
    return (
        <div className="relative mx-auto w-full max-w-[650px]">
            <div className="absolute -inset-8 rounded-full bg-emerald-400/10 blur-3xl"/>

            <div
                className="relative overflow-hidden rounded-2xl border border-white/15 bg-white p-3 shadow-2xl shadow-black/30 sm:p-5">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                    <div className="flex items-center gap-2">
                        <div className="rounded-lg bg-emerald-500 p-2 text-white">
                            <Wallet size={17}/>
                        </div>
                        <span className="font-bold text-slate-800">WealthWise</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="hidden text-xs text-slate-400 sm:block">Demo dashboard</span>
                        <div className="h-8 w-8 rounded-full bg-emerald-100"/>
                    </div>
                </div>

                <div className="py-5">
                    <p className="text-xs text-slate-400">Good morning, Alex 👋</p>
                    <h3 className="mt-1 text-lg font-bold text-slate-900 sm:text-xl">Your financial overview</h3>

                    <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
                        {[
                            ["Total Balance", "₹1,45,000", TrendingUp],
                            ["Monthly Income", "₹45,000", TrendingUp],
                            ["Expenses", "₹18,500", TrendingDown],
                        ].map(([label, value, Icon]) => (
                            <div key={label} className="rounded-xl border border-slate-100 bg-slate-50 p-3">
                                <Icon size={15} className="text-emerald-500"/>
                                <p className="mt-3 text-[10px] text-slate-400">{label}</p>
                                <p className="mt-1 text-sm font-extrabold text-slate-800 sm:text-base">{value}</p>
                            </div>
                        ))}
                    </div>

                    <div className="mt-4 grid gap-3 sm:grid-cols-[1.4fr_1fr]">
                        <div className="rounded-xl border border-slate-100 p-3">
                            <p className="text-xs font-bold text-slate-700">Cash flow</p>
                            <div className="mt-4 flex h-28 items-end justify-around gap-2">
                                {[42, 65, 48, 85, 57, 95, 70].map((height, i) => (
                                    <div key={i} className="flex h-full flex-1 items-end">
                                        <div
                                            className="w-full rounded-t-md bg-gradient-to-t from-emerald-600 to-emerald-300"
                                            style={{height: `${height}%`}}
                                        />
                                    </div>
                                ))}
                            </div>
                            <div className="mt-2 flex justify-between text-[9px] text-slate-400">
                                {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(day => <span
                                    key={day}>{day}</span>)}
                            </div>
                        </div>

                        <div className="rounded-xl border border-slate-100 p-3">
                            <p className="text-xs font-bold text-slate-700">Savings progress</p>
                            <div
                                className="mx-auto mt-4 flex h-24 w-24 items-center justify-center rounded-full border-[9px] border-emerald-100 border-t-emerald-500 border-r-emerald-500">
                                <div className="text-center">
                                    <p className="text-xl font-extrabold text-slate-800">68%</p>
                                    <p className="text-[9px] text-slate-400">Completed</p>
                                </div>
                            </div>
                            <p className="mt-3 text-center text-xs font-semibold text-slate-600">Emergency Fund</p>
                        </div>
                    </div>
                </div>
                <div
                    className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2 text-[10px] text-slate-400">
                    <span>Illustrative demo data</span>
                    <span>INR · WealthWise</span>
                </div>
            </div>
            <div className="mx-auto mt-1 h-3 w-[82%] rounded-b-xl bg-slate-300/80"/>
            <div className="mx-auto h-2 w-[90%] rounded-b-full bg-slate-400/50"/>
        </div>
    );
}

function PhonePreview() {
    return (
        <div
            className="absolute -bottom-10 -left-5 hidden w-[150px] rounded-[26px] border-[5px] border-slate-800 bg-white p-3 shadow-2xl xl:block">
            <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-slate-300"/>
            <p className="text-[9px] text-slate-400">Your savings</p>
            <p className="mt-1 text-lg font-extrabold text-slate-900">₹32,500</p>
            <div className="mt-3 rounded-xl bg-emerald-50 p-2">
                <Target size={15} className="text-emerald-600"/>
                <p className="mt-2 text-[9px] font-bold text-slate-800">Travel Fund</p>
                <p className="mt-1 text-[9px] text-slate-500">65% achieved</p>
                <div className="mt-2 h-1.5 rounded-full bg-emerald-100">
                    <div className="h-full w-[65%] rounded-full bg-emerald-500"/>
                </div>
            </div>
            <div className="mt-3 space-y-2">
                <div className="h-2 rounded bg-slate-100"/>
                <div className="h-2 w-4/5 rounded bg-slate-100"/>
            </div>
        </div>
    );
}

function ProductPreview({type}) {
    if (type === "dashboard") return <DashboardPreview/>;

    const rows = {
        transactions: [
            ["Salary", "+ ₹45,000", "text-emerald-600"],
            ["Groceries", "- ₹2,400", "text-slate-700"],
            ["Transport", "- ₹850", "text-slate-700"],
            ["Freelance", "+ ₹8,000", "text-emerald-600"],
        ],
        budgets: [
            ["Food & Dining", "₹4,500 / ₹6,000", 75],
            ["Transport", "₹1,800 / ₹3,000", 60],
            ["Shopping", "₹3,200 / ₹5,000", 64],
            ["Entertainment", "₹900 / ₹2,000", 45],
        ],
        goals: [
            ["Emergency Fund", "₹30,000 / ₹50,000", 60],
            ["New Laptop", "₹42,000 / ₹60,000", 70],
            ["Vacation", "₹15,000 / ₹40,000", 38],
        ],
    };

    return (
        <div className="min-h-[225px] rounded-2xl border border-slate-200 bg-white p-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <span className="text-sm font-bold text-slate-800">
                    {type === "transactions" ? "Recent transactions" : type === "budgets" ? "Monthly budgets" : "Your savings goals"}
                </span>
                <span
                    className="rounded-lg bg-emerald-50 px-2 py-1 text-[10px] font-semibold text-emerald-700">Demo</span>
            </div>

            <div className="mt-4 space-y-4">
                {rows[type].map((row, i) => (
                    <div key={row[0]}>
                        <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2">
                                <span
                                    className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                                    {type === "transactions" ? <CreditCard size={13}/> : type === "budgets" ?
                                        <Wallet size={13}/> : <Target size={13}/>}
                                </span>
                                <span className="text-xs font-semibold text-slate-700">{row[0]}</span>
                            </div>
                            {type === "transactions" ? (
                                <span className={`text-xs font-bold ${row[2]}`}>{row[1]}</span>
                            ) : (
                                <span className="text-[10px] text-slate-500">{row[1]}</span>
                            )}
                        </div>
                        {type !== "transactions" && (
                            <div className="ml-9 mt-2 h-1.5 rounded-full bg-slate-100">
                                <div className="h-full rounded-full bg-emerald-500" style={{width: `${row[2]}%`}}/>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default function LandingPage() {
    const [menuOpen, setMenuOpen] = useState(false);
    const [openFaq, setOpenFaq] = useState(0);

    const closeMenu = () => setMenuOpen(false);

    return (
        <main className="overflow-hidden bg-white font-sans text-slate-800">
            {/* NAVIGATION */}
            <header
                className="absolute left-0 right-0 top-0 z-50 border-b border-white/10 bg-slate-950/40 backdrop-blur-md">
                <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8">
                    <Brand light/>

                    <nav className="hidden items-center gap-8 lg:flex">
                        {[
                            ["Features", "#features"],
                            ["How It Works", "#how-it-works"],
                            ["Why WealthWise", "#trust"],
                            ["FAQ", "#faq"],
                        ].map(([label, href]) => (
                            <a key={label} href={href}
                               className="text-sm font-medium text-slate-300 transition hover:text-white">
                                {label}
                            </a>
                        ))}
                    </nav>

                    <div className="hidden items-center gap-3 lg:flex">
                        <Link to="/login"
                              className="px-4 py-2.5 text-sm font-semibold text-white transition hover:text-emerald-300">
                            Sign In
                        </Link>
                        <Link to="/register"
                              className="rounded-xl bg-emerald-500 px-5 py-2.5 text-sm font-bold text-slate-950 shadow-lg shadow-emerald-500/20 transition hover:bg-emerald-400">
                            Get Started Free <ArrowRight className="ml-1 inline" size={15}/>
                        </Link>
                    </div>

                    <button className="rounded-lg p-2 text-white lg:hidden" onClick={() => setMenuOpen(!menuOpen)}
                            aria-label="Toggle navigation">
                        {menuOpen ? <X/> : <Menu/>}
                    </button>
                </div>

                {menuOpen && (
                    <div className="border-t border-white/10 bg-slate-950 p-5 lg:hidden">
                        <nav className="flex flex-col gap-4">
                            {[
                                ["Features", "#features"],
                                ["How It Works", "#how-it-works"],
                                ["Why WealthWise", "#trust"],
                                ["FAQ", "#faq"],
                            ].map(([label, href]) => (
                                <a key={label} href={href} onClick={closeMenu}
                                   className="text-sm font-medium text-slate-200">{label}</a>
                            ))}
                            <Link to="/login" onClick={closeMenu} className="text-sm font-semibold text-white">Sign
                                In</Link>
                            <Link to="/register" onClick={closeMenu}
                                  className="rounded-xl bg-emerald-500 px-4 py-3 text-center text-sm font-bold text-slate-950">Get
                                Started Free</Link>
                        </nav>
                    </div>
                )}
            </header>

            {/* HERO */}
            <section className="relative isolate bg-[#062b24] pb-24 pt-32 text-white sm:pt-40 lg:pb-32">
                <div
                    className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_75%_45%,rgba(16,185,129,0.22),transparent_45%),radial-gradient(ellipse_at_5%_5%,rgba(20,184,166,0.12),transparent_35%)]"/>
                <div className="absolute right-[8%] top-36 hidden text-emerald-300/30 lg:block"><Sparkles size={34}/>
                </div>
                <div className="absolute bottom-24 left-[5%] hidden text-emerald-300/30 lg:block"><TrendingUp
                    size={32}/></div>

                <div className="mx-auto grid max-w-7xl items-center gap-16 px-5 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
                    <div className="relative z-10">
                        <div
                            className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-4 py-2 text-xs font-semibold text-emerald-300">
                            <Sparkles size={14}/> Your personal financial companion
                        </div>
                        <h1 className="max-w-2xl text-4xl font-extrabold leading-[1.12] tracking-tight sm:text-5xl lg:text-[62px]">
                            Track Today.
                            <span className="block text-emerald-400">Build a Wealthier</span>
                            Tomorrow.
                        </h1>
                        <p className="mt-6 max-w-xl text-base leading-8 text-slate-300 sm:text-lg">
                            Take control of your money, build smarter financial habits and turn your goals into reality
                            — all in one simple place.
                        </p>
                        <div className="mt-9 flex flex-wrap gap-4">
                            <Link to="/register"
                                  className="rounded-xl bg-emerald-500 px-6 py-4 text-sm font-bold text-slate-950 shadow-xl shadow-emerald-500/20 transition hover:-translate-y-1 hover:bg-emerald-400">
                                Get Started Free <ArrowRight className="ml-2 inline" size={17}/>
                            </Link>
                            <a href="#showcase"
                               className="rounded-xl border border-white/20 bg-white/5 px-6 py-4 text-sm font-semibold text-white transition hover:bg-white/10">
                                <Play className="mr-2 inline" size={16}/> Watch Demo
                            </a>
                        </div>
                        <div className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-3 text-xs text-slate-400">
                            <span className="flex items-center gap-2"><CheckCircle2 size={15}
                                                                                    className="text-emerald-400"/> Manual money tracking</span>
                            <span className="flex items-center gap-2"><CheckCircle2 size={15}
                                                                                    className="text-emerald-400"/> INR focused</span>
                        </div>
                    </div>

                    <div className="relative pb-4 pt-4 sm:px-5">
                        <DashboardPreview/>
                        <PhonePreview/>
                    </div>
                </div>
            </section>

            {/* FEATURES */}
            <section id="features" className="scroll-mt-20 bg-white px-5 py-24 lg:px-8">
                <div className="mx-auto max-w-7xl">
                    <div className="mx-auto max-w-2xl text-center">
                        <span className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-600">Everything in one place</span>
                        <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">Everything
                            you need to manage your money</h2>
                        <p className="mt-4 text-base leading-7 text-slate-500">Simple tools that help you understand
                            your finances, make better decisions and stay focused on what matters.</p>
                    </div>

                    <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                        {features.map(({icon: Icon, title, description, color}) => (
                            <article key={title}
                                     className="group rounded-2xl border border-slate-100 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-emerald-100 hover:shadow-xl hover:shadow-emerald-900/5">
                                <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${color}`}>
                                    <Icon size={23}/>
                                </div>
                                <h3 className="mt-5 text-base font-bold text-slate-900">{title}</h3>
                                <p className="mt-2 text-sm leading-6 text-slate-500">{description}</p>
                            </article>
                        ))}
                    </div>
                </div>
            </section>

            {/* PRODUCT SHOWCASE */}
            <section id="showcase" className="scroll-mt-20 bg-[#f4faf7] px-5 py-24 lg:px-8">
                <div className="mx-auto max-w-7xl">
                    <div className="mx-auto max-w-2xl text-center">
                        <span className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-600">See WealthWise in action</span>
                        <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">A clearer
                            view of your financial life</h2>
                        <p className="mt-4 text-base leading-7 text-slate-500">Explore the tools that bring your
                            everyday money management together.</p>
                    </div>

                    <div className="mt-14 grid gap-7 md:grid-cols-2">
                        {showcase.map(({title, description, icon: Icon, color, preview}) => (
                            <article key={title}
                                     className="overflow-hidden rounded-3xl border border-slate-200/70 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl sm:p-7">
                                <div className="flex items-center gap-3">
                                    <div className={`rounded-xl bg-gradient-to-br ${color} p-3 text-white shadow-lg`}>
                                        <Icon size={21}/>
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-slate-900">{title}</h3>
                                        <p className="mt-1 text-xs text-slate-500">{description}</p>
                                    </div>
                                </div>
                                <div className="mt-6">
                                    <ProductPreview type={preview}/>
                                </div>
                            </article>
                        ))}
                    </div>
                    <p className="mt-6 text-center text-xs text-slate-400">Illustrative interface previews using sample
                        financial data.</p>
                </div>
            </section>

            {/* HOW IT WORKS */}
            <section id="how-it-works" className="scroll-mt-20 bg-white px-5 py-24 lg:px-8">
                <div className="mx-auto max-w-7xl">
                    <div className="mx-auto max-w-2xl text-center">
                        <span className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-600">Your journey starts here</span>
                        <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">Four
                            simple steps to financial clarity</h2>
                        <p className="mt-4 text-base leading-7 text-slate-500">Start small, stay consistent and make
                            progress at your own pace.</p>
                    </div>

                    <div className="relative mt-16 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
                        <div
                            className="absolute left-[12%] right-[12%] top-8 hidden border-t-2 border-dashed border-emerald-200 lg:block"/>
                        {steps.map(({number, icon: Icon, title, description}) => (
                            <div key={number} className="relative text-center">
                                <div
                                    className="relative mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-emerald-100 bg-emerald-50 text-emerald-600 shadow-sm">
                                    <Icon size={27}/>
                                    <span
                                        className="absolute -right-2 -top-2 flex h-7 w-7 items-center justify-center rounded-full bg-emerald-600 text-[10px] font-bold text-white">{number}</span>
                                </div>
                                <h3 className="mt-6 font-bold text-slate-900">{title}</h3>
                                <p className="mx-auto mt-2 max-w-xs text-sm leading-6 text-slate-500">{description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* TRUST */}
            <section id="trust" className="scroll-mt-20 bg-[#f4faf7] px-5 py-24 lg:px-8">
                <div className="mx-auto max-w-7xl">
                    <div className="grid items-center gap-12 lg:grid-cols-[0.85fr_1.15fr]">
                        <div>
                            <span className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-600">Designed around you</span>
                            <h2 className="mt-4 text-3xl font-extrabold leading-tight tracking-tight text-slate-900 sm:text-4xl">Your
                                finances deserve a simpler, more organised home.</h2>
                            <p className="mt-5 leading-8 text-slate-500">WealthWise brings everyday financial tracking
                                into one organised experience. You stay in control of the information you enter and the
                                goals you choose to pursue.</p>
                            <Link to="/register"
                                  className="mt-7 inline-flex items-center gap-2 font-bold text-emerald-700 transition hover:gap-3">
                                Start your journey <ArrowRight size={17}/>
                            </Link>
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2">
                            {trustItems.map(({icon: Icon, title, description}) => (
                                <article key={title}
                                         className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
                                    <div
                                        className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                                        <Icon size={22}/>
                                    </div>
                                    <h3 className="mt-4 font-bold text-slate-900">{title}</h3>
                                    <p className="mt-2 text-sm leading-6 text-slate-500">{description}</p>
                                </article>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* FAQ */}
            <section id="faq" className="scroll-mt-20 bg-white px-5 py-24 lg:px-8">
                <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.8fr_1.2fr]">
                    <div>
                        <span className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-600">Need to know more?</span>
                        <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">Frequently
                            asked questions</h2>
                        <p className="mt-4 leading-7 text-slate-500">A few answers to help you get started with
                            WealthWise.</p>
                        <div className="mt-7 flex items-center gap-3 rounded-2xl bg-emerald-50 p-4 text-emerald-800">
                            <CircleHelp size={24}/>
                            <p className="text-sm font-medium">Still curious? Explore the product or create your
                                account.</p>
                        </div>
                    </div>

                    <div className="space-y-3">
                        {faqs.map((faq, index) => (
                            <article key={faq.question} className="rounded-xl border border-slate-200 bg-white px-5">
                                <button className="flex w-full items-center justify-between gap-4 py-5 text-left"
                                        onClick={() => setOpenFaq(openFaq === index ? -1 : index)}>
                                    <span className="text-sm font-bold text-slate-800">{faq.question}</span>
                                    <ChevronDown size={18}
                                                 className={`shrink-0 text-emerald-600 transition-transform ${openFaq === index ? "rotate-180" : ""}`}/>
                                </button>
                                {openFaq === index && (
                                    <p className="pb-5 text-sm leading-7 text-slate-500">{faq.answer}</p>
                                )}
                            </article>
                        ))}
                    </div>
                </div>
            </section>

            {/* CLOSING CTA */}
            <section className="relative overflow-hidden bg-[#062b24] px-5 py-20 text-white lg:px-8 lg:py-24">
                <div className="absolute -right-20 -top-32 h-96 w-96 rounded-full bg-emerald-500/10 blur-3xl"/>
                <div
                    className="relative mx-auto flex max-w-7xl flex-col items-center justify-between gap-10 text-center lg:flex-row lg:text-left">
                    <div className="max-w-2xl">
                        <span className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-300">Make your next move count</span>
                        <h2 className="mt-4 text-3xl font-extrabold leading-tight sm:text-4xl lg:text-5xl">Your
                            financial future starts with one small step.</h2>
                        <p className="mt-5 max-w-xl leading-7 text-emerald-100/70">Start organising your money, building
                            positive habits and working towards the goals that matter to you.</p>
                        <div className="mt-8 flex flex-wrap justify-center gap-4 lg:justify-start">
                            <Link to="/register"
                                  className="rounded-xl bg-emerald-500 px-6 py-4 text-sm font-bold text-slate-950 transition hover:bg-emerald-400">
                                Get Started Free <ArrowRight className="ml-2 inline" size={17}/>
                            </Link>
                            <Link to="/login"
                                  className="rounded-xl border border-white/20 px-6 py-4 text-sm font-semibold text-white transition hover:bg-white/10">
                                Sign In
                            </Link>
                        </div>
                    </div>
                    <div
                        className="flex h-52 w-52 shrink-0 items-center justify-center rounded-full border border-emerald-300/20 bg-emerald-400/10">
                        <div
                            className="flex h-36 w-36 items-center justify-center rounded-full border border-emerald-300/30 bg-emerald-400/10">
                            <div
                                className="flex h-24 w-24 items-center justify-center rounded-3xl bg-emerald-500 text-slate-950 shadow-2xl shadow-emerald-500/30">
                                <TrendingUp size={48}/>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* FOOTER */}
            <footer className="bg-[#041e19] px-5 py-12 text-slate-400 lg:px-8">
                <div className="mx-auto grid max-w-7xl gap-10 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1fr]">
                    <div>
                        <Brand light/>
                        <p className="mt-4 max-w-xs text-sm leading-7 text-slate-400">Your money, in balance. Build
                            better financial habits and work towards a wealthier tomorrow.</p>
                        <div className="mt-5 flex gap-3">
                            {[Globe, Globe].map((Icon, index) => (
                                <span
                                    key={index}
                                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 text-slate-400"
                                >
            <Icon size={16} />
        </span>
                            ))}
                        </div>

                    </div> {/* Close WealthWise footer column */}

                        <div>
                            <h4 className="font-bold text-white">Explore</h4>
                            <div className="mt-5 space-y-3 text-sm">
                                <a className="block transition hover:text-emerald-400" href="#features">Features</a>
                                <a className="block transition hover:text-emerald-400" href="#showcase">Product demo</a>
                                <a className="block transition hover:text-emerald-400" href="#how-it-works">How it
                                    works</a>
                                <a className="block transition hover:text-emerald-400" href="#faq">FAQ</a>
                            </div>
                        </div>

                        <div>
                            <h4 className="font-bold text-white">Account</h4>
                            <div className="mt-5 space-y-3 text-sm">
                                <Link className="block transition hover:text-emerald-400" to="/login">Sign In</Link>
                                <Link className="block transition hover:text-emerald-400" to="/register">Create
                                    Account</Link>
                            </div>
                        </div>

                        <div>
                            <h4 className="font-bold text-white">Legal</h4>
                            <div className="mt-5 space-y-3 text-sm">
                                <span className="block">Privacy Policy</span>
                                <span className="block">Terms of Use</span>
                                <span className="block">Contact</span>
                            </div>
                        </div>
                    </div>

                    <div
                        className="mx-auto mt-12 flex max-w-7xl flex-col justify-between gap-3 border-t border-white/10 pt-6 text-xs sm:flex-row">
                        <p>© {new Date().getFullYear()} WealthWise. All rights reserved.</p>
                        <p>Financial Habit Builder & Wealth Growth Tracker</p>
                    </div>
            </footer>
        </main>
);
}
