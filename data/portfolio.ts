export const PORTFOLIO_DATA = {
  personal: {
    name: "NGUYEN KHANG HY",
    alias: "HyIsNoob",
    role: "CS Student, Creative Developer & Editor",
    location: "Ho Chi Minh City, Vietnam",
    email: "khanghyomni@gmail.com",
  },
  about: {
    title: "Who am I?",
    description:
      "I'm a 20-year-old Computer Science student at UIT (VNU-HCM) with a deep passion for Video Editing and Game Development. I blend technical skills with creative vision to build immersive digital experiences.",
    details: [
      "Computer Science Student K18 at UIT",
      "Third Prize in High School Science Research Award (2021)",
      "1,000+ Subscribers on YouTube",
    ],
  },
  services: [
     {
        title: "Web Development",
        description: "Building modern, responsive, and interactive websites using Next.js, React, and Tailwind CSS.",
        tags: ["Frontend", "Animation", "SEO"]
     },
     {
        title: "Video Editing",
        description: "Creating engaging video content with professional cuts, motion graphics, and sound design.",
        tags: ["Filmora", "Motion Graphics", "Storytelling"]
     },
     {
        title: "Game Development",
        description: "Designing and programming immersive games with Unity and C#, focusing on gameplay mechanics.",
        tags: ["Unity", "C#", "Level Design"]
     },
     {
        title: "Desktop Apps",
        description: "Developing cross-platform desktop applications using Electron.js for efficient workflows.",
        tags: ["Electron", "Node.js", "Automation"]
     }
  ],
  games: [
    {
        id: "G02",
        title: "Echoes Apogee",
        category: "2D Top-down Shooter",
        description: "A fast-paced survival shooter. Build your kit, survive waves, and crush bosses.",
        longDescription: "A survival roguelite where you grow stronger as waves escalate. Choose from diverse upgrade cards upon leveling up to build unique combat kits. Features 5 intense waves, 2 enemy families with variants, and challenging minibosses. Survive to the endless mode!",
        features: [
            "Roguelite Progression System",
            "5 Unique Skills & Upgrade Paths",
            "Endless Mode after 10 minutes",
            "Award: Game of The Lab (Top 1 Class Project)"
        ],
        image: "/game/Echoes/tCgZ6B.png",
        gallery: [
            "/game/Echoes/tCgZ6B.png",
            "/game/Echoes/RU0t+W.png",
            "/game/Echoes/zVa9nm.png"
        ],
        link: "https://hyisnoob.itch.io/echoes-apogee",
        tech: ["Unity", "C#", "2D Animation", "Roguelite Logic"]
    },
    {
        id: "G01",
        title: "Roll A FrieBall",
        category: "3D Platformer / Action",
        description: "A souped-up Roll-A-Ball prototype with parkour mechanics and enemy chase AI.",
        longDescription: "A high-octane 3D platformer where speed is key. Master parkour moves like double jumps, wall-bounces, dashes, and slams to navigate complex levels. Features dynamic checkpoints, a countdown timer, and intense enemy chase AI. Collect all pickups before time runs out!",
        features: [
            "Advanced Movement: Dash, Wall-Bounce, Slam",
            "Enemy Chase AI & Dynamic Checkpoints",
            "3 Camera Modes (Orbital, Fixed, Map)",
            "Award: Game of The Lab (Top 1 Class Project)"
        ],
        image: "/game/FrieBall/plus61g5e.png",
        gallery: [
            "/game/FrieBall/plus61g5e.png",
            "/game/FrieBall/UmGZfO.png", 
            "/game/FrieBall/LeNkOs.png",
            "/game/FrieBall/crTo1O.png",
            "/game/FrieBall/_07VNs.png"
        ],
        link: "https://hyisnoob.itch.io/roll-a-frieball",
        tech: ["Unity", "C#", "3D Physics", "Cinemachine"]
    }
  ],
  videos: [
    {
      id: "d9BVBCA0HHY",
      title: "AMV - Cinematic Edit",
      thumbnail: "https://img.youtube.com/vi/d9BVBCA0HHY/maxresdefault.jpg"
    },
    {
      id: "QfESXLfQ7TE",
      title: "Game Montage",
      thumbnail: "https://img.youtube.com/vi/QfESXLfQ7TE/maxresdefault.jpg"
    },
    {
      id: "eLTGn_YxgEE",
      title: "VFX Showcase",
      thumbnail: "https://img.youtube.com/vi/eLTGn_YxgEE/maxresdefault.jpg"
    },
    {
      id: "TtdQGgZCtbM",
      title: "Motion Graphics Demo",
      thumbnail: "https://img.youtube.com/vi/TtdQGgZCtbM/maxresdefault.jpg"
    }
  ],
  projects: [
    {
      id: "01",
      title: "UIT MANAGER",
      category: "Electron App",
      description: "Comprehensive management app for UIT students including schedule and homework tracking.",
      longDescription: "A powerful desktop application designed specifically for UIT students to manage their academic life. Features include automatic schedule import, deadline tracking, grade calculation, and personalized reminders. Built with Electron and React for a seamless native experience.",
      image: "/UIT-Manager.png",
      gallery: [
        "/UIT-Manager.png",
        "/UIT-Manager2.png",
        "/UIT-Manager3.png",
        "/UIT-Manager4.png"
      ],
      link: "https://github.com/HyIsNoob/uit-manager",
      tech: ["Electron", "React", "Node.js", "SQLite"]
    },
    {
      id: "02",
      title: "DESUWA",
      category: "Web Development",
      description: "A fun, static meme site for Wuthering Waves character Carlotta.",
      longDescription: "An interactive and humorous static website dedicated to the character Carlotta from Wuthering Waves. The project focuses on creative UI animations, meme culture integration, and providing a delightful user experience through visual storytelling.",
      image: "/Desuwa.png",
      link: "https://github.com/HyIsNoob/Desuwa",
      tech: ["HTML/CSS", "JavaScript", "Animations"]
    },
    {
      id: "03",
      title: "HISTORY GRADING",
      category: "AI / Web",
      description: "Automated essay grading system for History subject. 3rd Prize Science Research.",
      longDescription: "An award-winning research project that utilizes Natural Language Processing (NLP) to automatically grade history essays. The system analyzes keyword density, context relevance, and historical accuracy to provide instant feedback to students.",
      image: "/History.png",
      link: "https://github.com/HyIsNoob/History-Grading-Web",
      tech: ["Python", "NLP", "Flask", "React"]
    },
    {
      id: "04",
      title: "YOUTUBE CHANNEL",
      category: "Content Creation",
      description: "Game & Anime editing channel with over 1,000 subscribers.",
      longDescription: "A creative outlet showcasing high-energy game edits and anime music videos (AMVs). The channel has grown to a community of over 1,000 subscribers, featuring tutorials on editing techniques and showcase reels of visual effects mastery.",
      image: "/Youtube.png",
      link: "https://youtube.com/@hyisnoob1102",
      tech: ["Filmora", "Photoshop", "Motion Graphics"]
    },
  ],
  skills: {
    creative: [
      "Video Editing",
      "Motion Graphics",
      "Visual Effects",
      "Color Grading",
      "Content Creation",
    ],
    technical: [
      "JavaScript / TypeScript",
      "React / Next.js",
      "Python",
      "Electron",
      "WebGL / Three.js",
      "Tailwind CSS",
    ],
  },
  socials: [
    {
      name: "YouTube",
      link: "https://youtube.com/@hyisnoob1102",
      label: "1K+ Subs",
    },
    {
      name: "TikTok",
      link: "https://tiktok.com/@hyisno0b",
      label: "100+ Followers",
    },
    {
      name: "GitHub",
      link: "https://github.com/HyIsNoob",
      label: "@HyIsNoob",
    },
    {
      name: "Facebook",
      link: "https://facebook.com/hyisnoob1102/",
      label: "Connect",
    },
    {
      name: "Email",
      link: "mailto:khanghyomni@gmail.com",
      label: "Send Mail",
    },
  ],
};
