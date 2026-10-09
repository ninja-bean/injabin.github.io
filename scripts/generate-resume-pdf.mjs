import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

async function generateResumePdf() {
  const publicDir = path.join(process.cwd(), 'public');
  const pdfPath = path.join(publicDir, 'resume.pdf');
  const namedPdfPath = path.join(publicDir, 'Injabin_Alam_Resume.pdf');

  // Load the structured HTML template
  const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Injabin Alam - Software Engineer Resume</title>
  <style>
    @page {
      size: A4;
      margin: 14mm 16mm 14mm 16mm;
    }
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      color: #111827;
      background: #ffffff;
      line-height: 1.45;
      font-size: 9.5pt;
    }
    a {
      color: #0033a0;
      text-decoration: none;
    }
    a:hover {
      text-decoration: underline;
    }
    
    /* Header */
    .header {
      border-bottom: 2px solid #111827;
      padding-bottom: 8px;
      margin-bottom: 12px;
    }
    .header h1 {
      font-size: 22pt;
      font-weight: 800;
      letter-spacing: -0.5px;
      text-transform: uppercase;
      color: #111827;
      line-height: 1.1;
    }
    .header .title {
      font-size: 11pt;
      font-weight: 700;
      color: #0033a0;
      margin-top: 3px;
      letter-spacing: 0.5px;
      text-transform: uppercase;
    }
    .contact-bar {
      display: flex;
      flex-wrap: wrap;
      gap: 12px;
      margin-top: 6px;
      font-size: 8.5pt;
      color: #4b5563;
    }
    .contact-item {
      display: inline-flex;
      align-items: center;
    }
    .contact-item span.bullet {
      margin-right: 6px;
      font-weight: bold;
      color: #9ca3af;
    }

    /* Section styling */
    .section {
      margin-bottom: 11px;
    }
    .section-title {
      font-size: 10pt;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 1px;
      color: #111827;
      border-bottom: 1.5px solid #e5e7eb;
      padding-bottom: 2px;
      margin-bottom: 6px;
      display: flex;
      justify-content: space-between;
      align-items: baseline;
    }
    .section-title::after {
      content: "";
      display: block;
      height: 2px;
      background: #0033a0;
      width: 32px;
      margin-top: -1.5px;
    }

    /* Summary */
    .summary-text {
      font-size: 9pt;
      color: #374151;
      text-align: justify;
      line-height: 1.4;
    }

    /* Skills Grid */
    .skills-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 8.8pt;
    }
    .skills-table td {
      padding: 2.5px 0;
      vertical-align: top;
    }
    .skills-label {
      width: 170px;
      font-weight: 700;
      color: #1f2937;
    }
    .skills-val {
      color: #374151;
    }

    /* Experience & Projects */
    .item {
      margin-bottom: 8px;
    }
    .item-header {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      font-size: 9.5pt;
    }
    .item-title {
      font-weight: 700;
      color: #111827;
    }
    .item-role {
      font-weight: 600;
      color: #0033a0;
    }
    .item-meta {
      font-size: 8.5pt;
      color: #6b7280;
      font-weight: 500;
      text-align: right;
    }
    .item-sub {
      font-size: 8.5pt;
      color: #4b5563;
      margin-bottom: 2.5px;
      font-style: italic;
    }
    .bullet-list {
      list-style-type: disc;
      margin-left: 14px;
      font-size: 8.8pt;
      color: #374151;
    }
    .bullet-list li {
      margin-bottom: 2px;
      line-height: 1.35;
    }
    .tech-pill {
      display: inline-block;
      font-size: 7.5pt;
      font-weight: 700;
      background: #f3f4f6;
      border: 1px solid #d1d5db;
      padding: 0 4px;
      margin-left: 4px;
      border-radius: 2px;
      color: #111827;
      text-transform: uppercase;
    }

    /* Certifications & Education */
    .edu-item, .cert-item {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      margin-bottom: 3.5px;
      font-size: 9pt;
    }
    .cert-title {
      font-weight: 700;
      color: #111827;
    }
    .cert-issuer {
      color: #4b5563;
    }
  </style>
</head>
<body>

  <!-- HEADER -->
  <div class="header">
    <h1>Injabin Alam</h1>
    <div class="title">Software Engineer &bull; Full-Stack &amp; Systems Developer</div>
    <div class="contact-bar">
      <div class="contact-item"><span>Dhaka, Bangladesh</span></div>
      <div class="contact-item"><span class="bullet">&bull;</span><a href="mailto:injabin29@gmail.com">injabin29@gmail.com</a></div>
      <div class="contact-item"><span class="bullet">&bull;</span><a href="https://injabin.github.io" target="_blank">injabin.github.io</a></div>
      <div class="contact-item"><span class="bullet">&bull;</span><a href="https://github.com/ninja-bean" target="_blank">github.com/ninja-bean</a></div>
      <div class="contact-item"><span class="bullet">&bull;</span><a href="https://linkedin.com/in/injabin" target="_blank">linkedin.com/in/injabin</a></div>
      <div class="contact-item"><span class="bullet">&bull;</span><a href="https://www.hackerrank.com/profile/malam2330344" target="_blank">hackerrank.com/malam2330344</a></div>
    </div>
  </div>

  <!-- PROFESSIONAL SUMMARY -->
  <div class="section">
    <div class="section-title">Professional Summary</div>
    <p class="summary-text">
      Results-driven Software Engineer with proven hands-on experience building performant full-stack web applications, scalable backend systems, real-time telemetry pipelines, and algorithmic solutions. Track record serving as Scrum Master leading engineering teams, engineering high-throughput 3D WebGL simulators, and developing award-winning IoT platforms. Strong computer science foundation in Data Structures, Object-Oriented Architecture, and Distributed Services. Seeking software engineering roles across the enterprise software and IT sector.
    </p>
  </div>

  <!-- TECHNICAL SKILLS -->
  <div class="section">
    <div class="section-title">Technical Competencies</div>
    <table class="skills-table">
      <tr>
        <td class="skills-label">Languages:</td>
        <td class="skills-val">TypeScript, JavaScript (ES6+), Java, C++, Python, PHP, SQL (MySQL/PostgreSQL), HTML5, CSS3</td>
      </tr>
      <tr>
        <td class="skills-label">Frontend &amp; 3D:</td>
        <td class="skills-val">Next.js (App Router), React, Three.js, WebGL, Zustand, Tailwind CSS, Component Architecture</td>
      </tr>
      <tr>
        <td class="skills-label">Backend &amp; Systems:</td>
        <td class="skills-val">Node.js, Express, RESTful APIs, WebSockets, MQTT Protocol, JDBC, Relational Schema Normalization</td>
      </tr>
      <tr>
        <td class="skills-label">Engineering Practices:</td>
        <td class="skills-val">Agile / Scrum Master (HP Certified), Data Structures &amp; Algorithms (5-Star HackerRank), OOP Design Patterns, CI/CD, Git</td>
      </tr>
      <tr>
        <td class="skills-label">Hardware &amp; IoT:</td>
        <td class="skills-val">ESP32, Microcontrollers, Telemetry Streaming, Sensor Calibration, Autodesk Fusion 360 (Parametric CAD)</td>
      </tr>
    </table>
  </div>

  <!-- FEATURED PROJECTS -->
  <div class="section">
    <div class="section-title">Featured Software Engineering Projects</div>

    <!-- AlgoArena -->
    <div class="item">
      <div class="item-header">
        <div>
          <span class="item-title">AlgoArena</span> &ndash; <span class="item-role">3D Pathfinding Visualizer &amp; Heuristic Search Simulator</span>
          <span class="tech-pill">React</span><span class="tech-pill">TypeScript</span><span class="tech-pill">Three.js</span><span class="tech-pill">Zustand</span>
        </div>
        <div class="item-meta">2025 &bull; <a href="https://algo-arena-sim.vercel.app/" target="_blank">Live Demo</a> &bull; <a href="https://github.com/xrayian/AlgoArena" target="_blank">GitHub</a></div>
      </div>
      <ul class="bullet-list">
        <li>Implemented bidirectional A*, bidirectional BFS, simulated annealing, and hill climbing algorithms racing concurrently on dynamic 3D mazes.</li>
        <li>Extended classical algorithms to support multi-goal pathfinding heuristics and dynamic temperature cooling for local optima escape.</li>
        <li>Architected global state management in Zustand and WebGL render pipelines in Three.js, guaranteeing smooth 60fps performance during heavy wave explorations.</li>
      </ul>
    </div>

    <!-- Nexus Stock AI -->
    <div class="item">
      <div class="item-header">
        <div>
          <span class="item-title">Nexus Stock AI</span> &ndash; <span class="item-role">Fintech Market Analytics &amp; Generative Intelligence Engine</span>
          <span class="tech-pill">Next.js</span><span class="tech-pill">TypeScript</span><span class="tech-pill">Gemini API</span><span class="tech-pill">Tailwind</span>
        </div>
        <div class="item-meta">2025 &bull; <a href="https://nexus-stock-ai.vercel.app/dashboard" target="_blank">Live Demo</a> &bull; <a href="https://github.com/ninja-bean/fintech-ai-swe-proj-next-js" target="_blank">GitHub</a></div>
      </div>
      <ul class="bullet-list">
        <li>Served as Scrum Master for a 4-person engineering team, leading sprint planning, backlog grooming, PR reviews, and API contract specifications.</li>
        <li>Engineered a modular Next.js dashboard coupling live candlestick market feeds with contextual generative AI summaries via Google Gemini.</li>
        <li>Designed resilient API request handlers with client-side caching and fallback states to mitigate upstream rate-limits.</li>
      </ul>
    </div>

    <!-- AquaSweep -->
    <div class="item">
      <div class="item-header">
        <div>
          <span class="item-title">AquaSweep</span> &ndash; <span class="item-role">Autonomous Aquaculture IoT Platform &amp; Live Telemetry</span>
          <span class="tech-pill">ESP32</span><span class="tech-pill">C++</span><span class="tech-pill">MQTT</span><span class="tech-pill">Node.js</span>
        </div>
        <div class="item-meta">2024 &bull; <strong>Award: 3rd Runner-Up</strong> &bull; <a href="https://github.com/ninja-bean/AquaSweep" target="_blank">GitHub</a></div>
      </div>
      <ul class="bullet-list">
        <li>Engineered end-to-end telemetry system collecting physical sensor telemetry via ESP32 microcontrollers and publishing over MQTT broker.</li>
        <li>Developed a real-time responsive web dashboard for continuous environmental tracking and remote motor actuator dispatch.</li>
        <li>Awarded <strong>3rd Runner-Up</strong> at the UIU CSE Project Show for outstanding embedded-software reliability and architectural cohesion.</li>
      </ul>
    </div>

    <!-- NextNest -->
    <div class="item">
      <div class="item-header">
        <div>
          <span class="item-title">NextNest</span> &ndash; <span class="item-role">Enterprise Property Management Relational Database Engine</span>
          <span class="tech-pill">Java</span><span class="tech-pill">MySQL</span><span class="tech-pill">JDBC</span><span class="tech-pill">OOP</span>
        </div>
        <div class="item-meta">2024 &bull; <a href="https://github.com/ninja-bean" target="_blank">GitHub</a></div>
      </div>
      <ul class="bullet-list">
        <li>Architected normalized relational schema ensuring ACID transaction safety across complex property, tenant, and billing workflows.</li>
        <li>Structured code adhering to DAO and MVC design patterns, separating relational persistence, business logic, and graphical workstation views.</li>
      </ul>
    </div>

    <!-- GovConnect -->
    <div class="item">
      <div class="item-header">
        <div>
          <span class="item-title">GovConnect (DhakaGrid)</span> &ndash; <span class="item-role">Civic Incident &amp; Municipal Emergency Management Platform</span>
          <span class="tech-pill">PHP</span><span class="tech-pill">MySQL</span><span class="tech-pill">Next.js (Rewrite)</span>
        </div>
        <div class="item-meta">2024 &ndash; Present &bull; <a href="https://github.com/ninja-bean/Gov_Connect-DhakaGird-" target="_blank">GitHub</a></div>
      </div>
      <ul class="bullet-list">
        <li>Engineered municipal reporting application handling citizen incident reporting, verification lifecycles, and resolution tracking.</li>
        <li>Currently architecting a production modernization migrating backend services to Next.js App Router and TypeScript server actions.</li>
      </ul>
    </div>
  </div>

  <!-- WORK EXPERIENCE -->
  <div class="section">
    <div class="section-title">Professional Experience</div>

    <div class="item">
      <div class="item-header">
        <div>
          <span class="item-title">Outlier</span> &ndash; <span class="item-role">AI Data Contributor (Technical Evaluator)</span>
        </div>
        <div class="item-meta">Sep 2026 &ndash; Present &bull; Remote</div>
      </div>
      <ul class="bullet-list">
        <li>Evaluated and benchmarked complex programmatic and multimodal LLM outputs against strict quality and correctness rubrics.</li>
        <li>Provided structured code analysis, edge-case vulnerability assessments, and technical documentation to improve generative AI reliability.</li>
      </ul>
    </div>

    <div class="item">
      <div class="item-header">
        <div>
          <span class="item-title">UIU CanSat Team</span> &ndash; <span class="item-role">Engineering Intern (Airframe &amp; CAD Modeling)</span>
        </div>
        <div class="item-meta">Aug 2025 &ndash; Aug 2026 &bull; Dhaka, Bangladesh</div>
      </div>
      <ul class="bullet-list">
        <li>Engineered complete parametric 3D CAD assemblies in Autodesk Fusion 360 for an autonomous fixed-wing VTOL aircraft.</li>
        <li>Researched aerodynamic airflow properties using the NACA 4412 airfoil profile to optimize lift-to-drag efficiency during low-speed transition.</li>
      </ul>
    </div>
  </div>

  <!-- EDUCATION -->
  <div class="section">
    <div class="section-title">Education</div>
    <div class="edu-item">
      <div>
        <strong>United International University (UIU)</strong> &ndash; <span>B.Sc. in Computer Science &amp; Engineering</span>
      </div>
      <div class="item-meta">2022 &ndash; Present &bull; Dhaka, Bangladesh</div>
    </div>
    <div class="item-sub">
      Key Coursework: Data Structures &amp; Algorithms, Object-Oriented Programming, Database Management Systems, Operating Systems, Computer Networks, Software Engineering.
    </div>
  </div>

  <!-- CERTIFICATIONS & HONORS -->
  <div class="section">
    <div class="section-title">Certifications &amp; Distinctions</div>
    <div class="cert-item">
      <div><strong>Agile Project Management</strong> &ndash; HP LIFE eLearning (<a href="https://www.life-global.org/certificate/ad9340ec-597d-4fe6-aefa-2aba6d14a017" target="_blank">Verify Credential</a>)</div>
      <div class="item-meta">May 2026</div>
    </div>
    <div class="cert-item">
      <div><strong>Data Science &amp; Analytics</strong> &ndash; HP LIFE eLearning (<a href="https://www.life-global.org/certificate/0b1d3e49-91ab-4dcc-a26d-05802eb87ce4" target="_blank">Verify Credential</a>)</div>
      <div class="item-meta">May 2026</div>
    </div>
    <div class="cert-item">
      <div><strong>5-Star Java Problem Solving Badge</strong> &ndash; HackerRank (<a href="https://www.hackerrank.com/profile/malam2330344" target="_blank">Verify Profile</a>)</div>
      <div class="item-meta">Verified High-Tier Rank</div>
    </div>
    <div class="cert-item">
      <div><strong>University Physics Olympiad (UPC 2025)</strong> &ndash; Accomplishment Award (<a href="https://github.com/xrayian/UPC2025_951B" target="_blank">Competition Repo</a>)</div>
      <div class="item-meta">2025</div>
    </div>
  </div>

</body>
</html>
  `;

  console.log('Generating PDF with Playwright Chromium ...');
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await page.setContent(htmlContent, { waitUntil: 'networkidle' });

  // Generate PDF
  const pdfBuffer = await page.pdf({
    format: 'A4',
    printBackground: true,
    margin: {
      top: '12mm',
      bottom: '12mm',
      left: '14mm',
      right: '14mm',
    },
    preferCSSPageSize: true,
  });

  fs.writeFileSync(pdfPath, pdfBuffer);
  fs.writeFileSync(namedPdfPath, pdfBuffer);
  console.log(`Saved PDF to ${pdfPath} (${pdfBuffer.length} bytes)`);
  console.log(`Saved PDF to ${namedPdfPath}`);

  // Also take high-res preview screenshot of the resume
  const proofDir = path.join(process.cwd(), 'proof');
  if (!fs.existsSync(proofDir)) fs.mkdirSync(proofDir, { recursive: true });
  await page.setViewportSize({ width: 900, height: 1200 });
  await page.screenshot({ path: path.join(proofDir, 'resume_preview.png'), fullPage: true });
  console.log('Saved proof/resume_preview.png');

  await browser.close();
}

generateResumePdf().catch(console.error);
