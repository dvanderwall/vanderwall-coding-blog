# David R Vanderwall Coding Blog Homework

This repository contains the source code and supporting documentation for a multi-part coding assignment. The project includes:

1. **GitHub Website for Your Coding Blog:**  
   A custom homepage that serves as a hub for my coding blog, reflecting my work as a Structural and Systems Biology researcher and MD-PhD candidate at Harvard Medical School.

2. **Game Coding: Pac-Man:**  
   A fully functional, graphically pleasing Pac-Man game implemented using HTML5 Canvas, CSS, and JavaScript. The game includes multiple ghosts with unique behaviors (e.g., leaving a central cage and resetting on collision) and even stationary fruits with special effects.

3. **Data Scaffolding from the Internet:**  
   An auto-updating webpage that displays the latest arXiv papers related to Computational Structural Biology, AlphaFold, "3-Dimensional Motifs", and kinases. This page is updated every midnight via a Python script and GitHub Actions.

---

## Case Study: Using AI Copilot and ChatGPT to Solve the Assignment

In this project, I leveraged AI tools to accelerate development and solve complex integration challenges. Below is an overview of my process and how I used these tools:

### Tools Used
- **GitHub Copilot:**  
  Provided real-time code suggestions for HTML, CSS, JavaScript, and Python. It helped me generate boilerplate code for the homepage, Pac-Man game, and integration of the arXiv API.
- **ChatGPT:**  
  Assisted in generating detailed explanations, workflows (including GitHub Actions configurations), and refining the logic for auto-updating the arXiv page. ChatGPT’s iterative prompts guided the design of the API integration and deployment pipeline.
- **Other AI Platforms:**  
  I also referenced online resources and code examples suggested by AI tools, which served as inspiration for implementing game mechanics and handling edge cases (such as filtering papers published today).

### How I Designed and Adjusted My Prompts

#### 1. GitHub Website for Your Coding Blog
- **Initial Prompt:**  
  *"Design a professional homepage for a structural biology researcher and MD-PhD candidate at Harvard Medical School. The homepage should include navigation links to future pages such as a Pac-Man game and an arXiv papers page."*
- **Outcome:**  
  The AI provided a sleek HTML and CSS template that I then customized with my personal branding and content.

#### 2. Game Coding: Pac-Man
- **Initial Prompt:**  
  *"Provide a complete implementation of the Pac-Man game in HTML, CSS, and JavaScript. The game should include multiple ghosts that exit a central cage, and if a ghost collides with Pac-Man, the game should restart. Also, include stationary fruits in the corners that cause ghosts to return to the cage when collected."*
- **Outcome:**  
  I received a full implementation using HTML5 Canvas. I refined the code to adjust ghost behaviors, add additional gameplay features, and ensure the game was graphically pleasing.

#### 3. Data Scaffolding from the Internet (arXiv Papers Page)
- **Initial Prompt:**  
  *"Generate a Python script that uses the arXiv API to fetch the latest papers on Computational Structural Biology, AlphaFold, '3-Dimensional Motifs', and kinases. The script should filter results to show only today’s papers and generate an HTML page listing each paper’s title, authors, abstract, and a link to the PDF. Also, create a GitHub Actions workflow to run this script every midnight."*
- **Outcome:**  
  The AI provided a comprehensive solution consisting of a Python script (`fetch_arxiv.py`), a CSS file (`assets/arxiv.css`), and a GitHub Actions workflow (`.github/workflows/auto_update.yml`). I modified the filtering logic to display only today’s papers, ensuring the page always shows the latest research.

### Screenshots and Demonstration
- **Screenshots:**  
  *(Include screenshots of the homepage, the Pac-Man game in action, and the arXiv papers page with today’s results.)*
- **Video Tutorial:**  
  *(Optionally, provide a link to a video showing how you used GitHub Copilot and ChatGPT during development.)*

---

## Conclusion

This project is a testament to how AI tools like GitHub Copilot and ChatGPT can streamline complex coding tasks and integrations—from designing professional webpages and interactive games to automating data scaffolding with API integration and continuous deployment via GitHub Actions. I hope this case study inspires others to explore AI-assisted development to boost productivity and enhance learning.

---

*This repository is a work in progress and serves as a case study for using AI copilot tools in software development.*
