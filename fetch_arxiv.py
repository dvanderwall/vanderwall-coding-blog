import feedparser
import urllib.parse
from datetime import datetime

def fetch_arxiv_papers(keywords, max_results=20):
    """
    Fetch the latest arXiv papers that match the given keywords.
    """
    # URL-encode the keywords.
    query_keywords = urllib.parse.quote(keywords)
    query_url = (
        f"http://export.arxiv.org/api/query?search_query=all:{query_keywords}"
        f"&start=0&max_results={max_results}&sortBy=submittedDate&sortOrder=descending"
    )
    feed = feedparser.parse(query_url)
    papers = []
    for entry in feed.entries:
        paper = {
            "title": entry.title,
            "authors": ', '.join(author.name for author in entry.authors),
            "summary": entry.summary,
            "pdf_link": next((link.href for link in entry.links if link.type == "application/pdf"), "#"),
            "published": entry.published
        }
        papers.append(paper)
    return papers

def filter_papers_today(papers):
    """
    Return only those papers whose published date is today (UTC).
    """
    today_date = datetime.utcnow().date()
    filtered = []
    for paper in papers:
        # arXiv's published field is usually in ISO 8601 format like "2025-02-12T00:00:00Z"
        try:
            published_dt = datetime.strptime(paper['published'], "%Y-%m-%dT%H:%M:%SZ").date()
        except ValueError:
            try:
                published_dt = datetime.strptime(paper['published'], "%Y-%m-%d").date()
            except ValueError:
                continue
        if published_dt == today_date:
            filtered.append(paper)
    return filtered

def generate_html(papers, keywords):
    """
    Generate an HTML page that lists the arXiv papers.
    """
    update_time = datetime.utcnow().strftime('%Y-%m-%d %H:%M:%S UTC')
    paper_entries = ""
    if papers:
        for paper in papers:
            paper_entries += f"""
        <div class="paper">
            <h2 class="title"><a href="{paper['pdf_link']}" target="_blank">{paper['title']}</a></h2>
            <p class="authors"><strong>Authors:</strong> {paper['authors']}</p>
            <p class="published"><strong>Published:</strong> {paper['published']}</p>
            <p class="summary">{paper['summary']}</p>
        </div>
            """
    else:
        paper_entries = "<p>No papers have been published today.</p>"
    
    html_template = f"""<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Latest arXiv Papers on {keywords}</title>
    <link rel="stylesheet" href="assets/arxiv.css">
</head>
<body>
    <div class="container">
        <h1>Latest arXiv Papers on {keywords}</h1>
        <div class="update-time">Last updated: {update_time}</div>
        <div class="paper-list">
            {paper_entries}
        </div>
        <nav>
            <p><a href="index.html">Back to Homepage</a></p>
        </nav>
    </div>
</body>
</html>
    """
    return html_template

def main():
    # Define your keywords (using OR to combine multiple topics)
    keywords = 'Computational Structural Biology OR AlphaFold OR "3-Dimensional Motifs" OR kinases'
    papers = fetch_arxiv_papers(keywords, max_results=20)
    papers_today = filter_papers_today(papers)
    html_content = generate_html(papers_today, keywords)
    with open("arxiv.html", "w", encoding="utf-8") as f:
        f.write(html_content)
    print("arxiv.html has been updated.")

if __name__ == "__main__":
    main()
