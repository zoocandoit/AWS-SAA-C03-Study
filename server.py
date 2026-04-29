from __future__ import annotations

import json
import re
from dataclasses import dataclass
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from typing import Dict, List
from urllib.parse import urlparse


ROOT = Path(__file__).resolve().parent
APP_DIR = ROOT / "app"


@dataclass
class Question:
    set_id: str
    set_number: int
    question_number: int
    title: str
    prompt: str
    options: List[str]
    answer: str
    explanation: str
    notes: List[str]
    keywords: List[str]

    def to_dict(self) -> Dict[str, object]:
        return {
            "id": f"{self.set_id}-q{self.question_number}",
            "setId": self.set_id,
            "setNumber": self.set_number,
            "questionNumber": self.question_number,
            "title": self.title,
            "prompt": self.prompt,
            "options": self.options,
            "answer": self.answer,
            "explanation": self.explanation,
            "notes": self.notes,
            "keywords": self.keywords,
        }


def normalize_text(value: str) -> str:
    text = value.strip()
    text = re.sub(r"\n{3,}", "\n\n", text)
    return text


def extract_section(block: str, heading: str) -> str:
    pattern = rf"^### {re.escape(heading)}\s*$\n(.*?)(?=^### |\Z)"
    match = re.search(pattern, block, re.MULTILINE | re.DOTALL)
    return normalize_text(match.group(1)) if match else ""


def parse_notes(section: str) -> List[str]:
    notes: List[str] = []
    current = ""

    for raw_line in section.splitlines():
        line = raw_line.rstrip()
        stripped = line.strip()
        if not stripped:
            continue
        if stripped.startswith("- "):
            if current:
                notes.append(normalize_text(current))
            current = stripped[2:].strip()
        else:
            current = f"{current} {stripped}".strip()

    if current:
        notes.append(normalize_text(current))

    return notes


def parse_options(section: str) -> List[str]:
    matches = re.findall(r"^\d+\.\s+(.*)$", section, re.MULTILINE)
    return [normalize_text(item) for item in matches]


def parse_keywords(content: str) -> List[str]:
    match = re.search(r"^## 키워드\s*$\n(.*)$", content, re.MULTILINE | re.DOTALL)
    if not match:
        return []

    keywords = []
    for line in match.group(1).splitlines():
        stripped = line.strip()
        if stripped.startswith("- "):
            keywords.append(stripped[2:].strip())
    return keywords


def parse_question_blocks(content: str) -> List[str]:
    matches = list(re.finditer(r"^## 문제\s+(\d+)\s*$", content, re.MULTILINE))
    blocks: List[str] = []

    for index, match in enumerate(matches):
        start = match.start()
        end = matches[index + 1].start() if index + 1 < len(matches) else len(content)
        blocks.append(content[start:end].strip())

    return blocks


def parse_question_set(readme_path: Path) -> List[Question]:
    content = readme_path.read_text(encoding="utf-8")
    set_id = readme_path.parent.name
    set_number = int(set_id.lstrip("#"))
    keywords = parse_keywords(content)
    questions: List[Question] = []

    for block in parse_question_blocks(content):
        title_match = re.search(r"^## 문제\s+(\d+)\s*$", block, re.MULTILINE)
        if not title_match:
            continue

        question_number = int(title_match.group(1))
        prompt = extract_section(block, "문제")
        options = parse_options(extract_section(block, "선택지"))
        answer = extract_section(block, "정답")
        explanation = extract_section(block, "해설")
        notes = parse_notes(extract_section(block, "핵심 메모"))

        questions.append(
            Question(
                set_id=set_id,
                set_number=set_number,
                question_number=question_number,
                title=f"{set_id} / 문제 {question_number}",
                prompt=prompt,
                options=options,
                answer=answer,
                explanation=explanation,
                notes=notes,
                keywords=keywords,
            )
        )

    return questions


def load_question_bank() -> Dict[str, object]:
    set_dirs = sorted(
        [path for path in ROOT.iterdir() if path.is_dir() and re.fullmatch(r"#\d+", path.name)],
        key=lambda path: int(path.name[1:]),
    )

    questions: List[Question] = []
    sets = []

    for set_dir in set_dirs:
        readme_path = set_dir / "README.md"
        if not readme_path.exists():
            continue

        parsed_questions = parse_question_set(readme_path)
        questions.extend(parsed_questions)
        sets.append(
            {
                "id": set_dir.name,
                "number": int(set_dir.name[1:]),
                "questionCount": len(parsed_questions),
                "path": str(readme_path.relative_to(ROOT)).replace("\\", "/"),
            }
        )

    payload = {
        "title": "AWS SAA-C03 Review Bank",
        "setCount": len(sets),
        "questionCount": len(questions),
        "sets": sets,
        "questions": [question.to_dict() for question in questions],
    }
    return payload


class ReviewRequestHandler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(APP_DIR), **kwargs)

    def do_GET(self) -> None:
        parsed = urlparse(self.path)
        if parsed.path == "/api/questions":
            payload = json.dumps(load_question_bank(), ensure_ascii=False).encode("utf-8")
            self.send_response(200)
            self.send_header("Content-Type", "application/json; charset=utf-8")
            self.send_header("Content-Length", str(len(payload)))
            self.end_headers()
            self.wfile.write(payload)
            return

        if parsed.path in {"/", ""}:
            self.path = "/index.html"

        super().do_GET()

    def log_message(self, format: str, *args) -> None:
        return


def main() -> None:
    server = ThreadingHTTPServer(("127.0.0.1", 8000), ReviewRequestHandler)
    print("AWS SAA-C03 Review Bank")
    print("http://127.0.0.1:8000")
    server.serve_forever()


if __name__ == "__main__":
    main()
