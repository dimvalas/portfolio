import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const skills = [
    {
      name: "HTML",
      proficiency: "Proficient",
      description:
        "Proficient in structuring web content with semantic HTML5 for accessibility and SEO.",
    },
    {
      name: "CSS",
      proficiency: "Experienced",
      description:
        "Experienced in styling web pages with CSS3, including responsive design and animations.",
    },
    {
      name: "Typescript",
      proficiency: "Proficient",
      description:
        "Strong command of TypeScript for building robust, scalable, and type-safe applications.",
    },
    {
      name: "React",
      proficiency: "Experienced",
      description:
        "Adept at developing dynamic and interactive user interfaces with React and its ecosystem.",
    },
    {
      name: "Tailwind CSS",
      proficiency: "Proficient",
      description:
        "Highly skilled in rapid UI development using Tailwind CSS for utility-first styling.",
    },
    {
      name: "Next.js",
      proficiency: "Experienced",
      description:
        "Competent in building server-rendered and static Next.js applications with optimal performance.",
    },
    {
      name: "Node.js",
      proficiency: "Proficient",
      description:
        "Solid understanding of Node.js for basic backend development.",
    },
  ];

  useEffect(() => {
    const sections = document.querySelectorAll("section");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-in");
          }
        });
      },
      { threshold: 0.1 }
    );

    sections.forEach((section) => {
      section.classList.add("fade-in-from-top");
      observer.observe(section);
    });

    return () => {
      sections.forEach((section) => {
        observer.unobserve(section);
      });
    };
  }, []);

  return (
    <div
      className="flex flex-col m-0 p-0 overflow-x-hidden w-full min-h-screen bg-gray-100 font-sans"
      style={{
        backgroundImage:
          "linear-gradient(to right, #f0f0f0 1px, transparent 1px), linear-gradient(to bottom, #f0f0f0 1px, transparent 1px)",
        backgroundSize: "30px 30px",
        scrollBehavior: "smooth",
      }}
    >
      {/* Header Wrapper */}
      <div className="w-full fixed z-50 top-6 flex justify-center bg-gray-100/90 backdrop-blur-sm">
        {/* Header Section */}
        <header className="flex w-11/12 md:w-fit h-[50px] justify-between items-center px-4 py-7 rounded-full mx-auto border-2 border-gray-400 shadow-2xs">
          {/* Logo container with added margin */}
          <div className="md:mr-10 lg:mr-24">
            <Link
              href="/"
              rel="noopener noreferrer"
              className="font-sans text-gray-950 hover:text-gray-800 duration-100 font-bold text-xl"
            >
              DV.
            </Link>
          </div>

          {/* Desktop/Tablet Navigation */}
          <div className="hidden md:flex flex-row items-center gap-10 lg:gap-24">
            <nav className="flex flex-row gap-5">
              <a
                href="#about"
                rel="noopener noreferrer"
                className="font-sans text-gray-950 hover:text-gray-800 duration-100"
              >
                About
              </a>
              <a
                href="#contact"
                rel="noopener noreferrer"
                className="font-sans text-gray-950 hover:text-gray-800 duration-100"
              >
                Contact
              </a>
              <a
                href="#skills"
                rel="noopener noreferrer"
                className="font-sans text-gray-950 hover:text-gray-800 duration-100"
              >
                Skills
              </a>
            </nav>
            <Link
              href="https://github.com/dimvalas"
              rel="noopener noreferrer"
              target="_blank"
              className="font-sans text-gray-950 hover:text-gray-800 duration-100"
              aria-label="Link to Dimitris's GitHub profile"
            >
              <Image
                src="/github-image.png"
                alt="github logo"
                width={25}
                height={25}
                className="rounded-full"
              />
            </Link>
          </div>

          {/* Hamburger Menu Button for Mobile */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-950 focus:outline-none"
              aria-expanded={isMenuOpen}
              aria-controls="mobile-menu"
              aria-label="Toggle navigation menu"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d={
                    isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"
                  }
                ></path>
              </svg>
            </button>
          </div>
        </header>

        {/* Mobile Navigation Menu */}
        {isMenuOpen && (
          <nav
            id="mobile-menu"
            className="md:hidden absolute top-[70px] bg-gray-100/90 backdrop-blur-sm w-11/12 rounded-lg border-2 border-gray-400 flex flex-col items-center gap-4 py-4 transition-all duration-300 ease-in-out"
          >
            <a
              href="#about"
              onClick={() => setIsMenuOpen(false)}
              className="font-sans text-gray-950 hover:text-gray-800 duration-100 py-2"
            >
              About
            </a>
            <a
              href="#contact"
              onClick={() => setIsMenuOpen(false)}
              className="font-sans text-gray-950 hover:text-gray-800 duration-100 py-2"
            >
              Contact
            </a>
            <a
              href="#resume"
              onClick={() => setIsMenuOpen(false)}
              className="font-sans text-gray-950 hover:text-gray-800 duration-100 py-2"
            >
              Resume
            </a>
            <a
              href="#skills"
              onClick={() => setIsMenuOpen(false)}
              className="font-sans text-gray-950 hover:text-gray-800 duration-100 py-2"
            >
              Skills
            </a>
            <div className="mt-2">
              <Link
                href="https://github.com/dimvalas"
                rel="noopener noreferrer"
                target="_blank"
                className="font-sans text-gray-950 hover:text-gray-800 duration-100"
                aria-label="Link to Dimitris's GitHub profile"
              >
                <Image
                  src="/github-image.png"
                  alt="github logo"
                  width={25}
                  height={25}
                  className="rounded-full"
                />
              </Link>
            </div>
          </nav>
        )}
      </div>

      {/* Main Content Area Wrapper */}
      <div className="relative z-10">
        <main className="flex flex-col justify-center m-0 p-0">
          {/* Hero Section */}
          <section
            id="about"
            className="flex flex-col justify-center text-center px-4 py-40 fade-in-from-top"
          >
            <div className="bg-[rgba(23,23,23,0.9)] py-2 px-5 w-fit mx-auto rounded-full border-2 border-gray-400 shadow-2xs mb-12">
              <span className="font-black text-gray-100">
                Front-end Web Developer
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-gray-800 mb-7">
              I&apos;m Dimitris Valasellis
            </h1>
            <p className="text-gray-600 font-normal mb-5 px-4">
              Building elegant solutions with a focus on seamless user
              experiences. <br className="hidden md:block" /> I&apos;m passionate about creating amazing web
              applications that solve <br className="hidden md:block" /> real-world problems and am always
              looking for new challenges.
            </p>
            <div className="bg-[rgba(53,53,53,1)] py-2 px-5 w-fit mx-auto rounded-full border-2 border-gray-400 shadow-2xs">
              <Link
                href="#contact"
                className="font-black text-gray-100"
              >
                Let&apos;s Connect
              </Link>
            </div>
          </section>

          {/* Contact Section */}
          <section
            id="contact"
            className="justify-center flex flex-col text-center px-4 py-32 fade-in-from-top"
          >
            <h2 className="text-4xl md:text-5xl font-black text-gray-800 mb-7">
              Contact Me
            </h2>
            <p className="text-gray-600 font-normal mb-5 px-4">
              I&apos;d love to hear from you! Whether you have a question, a
              project idea, <br className="hidden md:block" /> or just want to connect, feel free to reach
              out. <br className="hidden md:block" /> You can contact me via email at{" "}
              <a
                href="mailto:dimitrisvalaselliss@gmail.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-950 hover:text-gray-800 duration-100"
              >
                dimitrisvalaselliss@gmail.com
              </a>
            </p>
            <div className="flex justify-center gap-3">
              <Image
                src="/discord-image.svg"
                alt="discord logo"
                width={150}
                height={25}
              />
              <Link
                href={"https://www.instagram.com/valas.dv"}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-950 hover:text-gray-800 duration-100"
                aria-label="Link to Dimitris's Instagram profile"
              >
                <Image
                  src="/instagram-image.svg"
                  alt="instagram logo"
                  width={150}
                  height={25}
                />
              </Link>
            </div>
          </section>

          {/* Skills Section */}
          <section
            id="skills"
            className="flex flex-col items-center justify-center px-4 md:px-12 py-40 fade-in-from-top"
          >
            <h2 className="text-4xl md:text-5xl font-black text-gray-800 mb-12">
              My Skills
            </h2>
            <div className="w-full max-w-6xl p-6 md:p-12 bg-gray-100 rounded-lg border border-gray-300">
              <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 md:mb-12">Skills</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-0 md:gap-x-[75px] gap-y-8">
                {skills.map((skill) => (
                  <div key={skill.name}>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-lg md:text-xl font-extrabold text-gray-900">
                        {skill.name}
                      </span>
                      <span className="text-sm text-gray-500 font-semibold italic">
                        {skill.proficiency}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 italic max-w-85">
                      {skill.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </main>
        <footer className="w-full text-center py-8 text-gray-500 text-sm">
          Handcoded by Dimitris Valasellis, 2025
        </footer>
      </div>
    </div>
  );
}
