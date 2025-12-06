import json
import os
import uuid
from typing import Any, Dict, List

FLOWS_DIR = os.path.join("data", "flows")


def _ensure_dir():
    os.makedirs(FLOWS_DIR, exist_ok=True)


def save_flow(flow: Dict[str, Any]) -> str:
    _ensure_dir()
    fid = flow.get("id") or str(uuid.uuid4())
    path = os.path.join(FLOWS_DIR, f"{fid}.json")
    with open(path, "w", encoding="utf-8") as f:
        json.dump(flow, f, indent=2)
    return fid


def list_flows() -> List[Dict[str, Any]]:
    _ensure_dir()
    out = []
    for fname in sorted(os.listdir(FLOWS_DIR)):
        if not fname.endswith(".json"):
            continue
        path = os.path.join(FLOWS_DIR, fname)
        try:
            with open(path, "r", encoding="utf-8") as f:
                data = json.load(f)
            out.append(
                {
                    "id": data.get("id") or fname[:-5],
                    "name": data.get("name") or fname[:-5],
                    "flow": data,
                }
            )
        except Exception:
            continue
    return out


def get_flow(flow_id: str) -> Dict[str, Any]:
    _ensure_dir()
    path = os.path.join(FLOWS_DIR, f"{flow_id}.json")
    if not os.path.exists(path):
        return {}
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)
