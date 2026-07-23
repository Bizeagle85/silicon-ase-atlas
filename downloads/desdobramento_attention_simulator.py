#!/usr/bin/env python3
"""Transparent matrix demonstration for ordered pairs and Transformer attention.

This program is an educational comparison, not a divination engine. It does not
name an odù, reproduce a lineage or house mapping, generate an ẹsẹ̀, decide
favorable/adverse orientation, prescribe ẹbọ/ebó, or claim spiritual efficacy.

The crucial distinction is kept executable:

1. A sixteen-object binary observation has 2**16 microstates. If only the number
   of 1 states is retained, there are 17 count categories (0..16). Two such
   counts form 17**2 = 289 ordered pairs.
2. A 16-by-16 = 256 ordered-pair table applies only after a declared rule maps
   each result into exactly sixteen categories. A rule grid is an exact lookup:
       result(a, b) = e_a^T G e_b
3. Transformer attention is a dense, input-dependent weighted mixture:
       softmax(Q K^T / sqrt(d_k)) V
   It is not an ordered-pair lookup, and Q/K/V are not names for two throws and
   a verse.

The default run simulates two neutral sixteen-bit records and prints both the
17-by-17 count address and a small, fully inspectable attention calculation.
"""

from __future__ import annotations

import argparse
import json
import math
import random
import secrets
from dataclasses import asdict, dataclass
from pathlib import Path
from typing import Any, Sequence


Vector = list[float]
Matrix = list[list[float]]


@dataclass(frozen=True)
class Observation:
    """One neutral sixteen-bit record and its reproducible statistics."""

    bits: tuple[int, ...]
    one_count: int
    microstate_id: int
    transitions: int
    features: tuple[float, float, float]


def parse_bits(value: str) -> tuple[int, ...]:
    """Parse exactly sixteen 0/1 characters, allowing spaces and underscores."""

    compact = value.replace(" ", "").replace("_", "")
    if len(compact) != 16 or any(character not in "01" for character in compact):
        raise argparse.ArgumentTypeError(
            "a bit record must contain exactly sixteen 0/1 characters"
        )
    return tuple(int(character) for character in compact)


def simulate_bits(probability_one: float, rng: random.Random) -> tuple[int, ...]:
    """Generate a neutral Bernoulli record; this is not a physical cast model."""

    if not 0.0 <= probability_one <= 1.0:
        raise ValueError("probability_one must be between 0 and 1")
    return tuple(int(rng.random() < probability_one) for _ in range(16))


def encode_microstate(bits: Sequence[int]) -> int:
    """Encode the first displayed position as the most significant bit."""

    if len(bits) != 16 or any(bit not in (0, 1) for bit in bits):
        raise ValueError("encode_microstate requires sixteen binary values")
    value = 0
    for bit in bits:
        value = (value << 1) | bit
    return value


def describe(bits: Sequence[int]) -> Observation:
    """Create features used only by the separate attention demonstration."""

    one_count = sum(bits)
    transitions = sum(left != right for left, right in zip(bits, bits[1:]))
    features = (
        one_count / 16.0,
        transitions / 15.0,
        float(one_count % 2),
    )
    return Observation(
        bits=tuple(bits),
        one_count=one_count,
        microstate_id=encode_microstate(bits),
        transitions=transitions,
        features=features,
    )


def ordered_count_address(first_count: int, second_count: int) -> int:
    """Serialize a pair in the 17-by-17 count space to the range 0..288."""

    if not 0 <= first_count <= 16 or not 0 <= second_count <= 16:
        raise ValueError("count categories must be in the inclusive range 0..16")
    return first_count * 17 + second_count


def decode_count_address(address: int) -> tuple[int, int]:
    """Invert ordered_count_address exactly."""

    if not 0 <= address < 289:
        raise ValueError("a 17-by-17 address must be in the range 0..288")
    return divmod(address, 17)


def one_hot(index: int, width: int = 16) -> Vector:
    """Return the basis vector e_index used in the bilinear lookup equation."""

    if not 0 <= index < width:
        raise ValueError(f"category index must be in the range 0..{width - 1}")
    return [1.0 if position == index else 0.0 for position in range(width)]


def validate_rule_grid(grid: Any) -> list[list[Any]]:
    """Require an exact 16-by-16 grid; cells may be strings, objects, or null."""

    if not isinstance(grid, list) or len(grid) != 16:
        raise ValueError("rule grid must contain exactly sixteen rows")
    if any(not isinstance(row, list) or len(row) != 16 for row in grid):
        raise ValueError("every rule-grid row must contain exactly sixteen cells")
    return grid


def bilinear_lookup(grid: list[list[Any]], first: int, second: int) -> Any:
    """Compute e_first^T G e_second, which reduces to one exact grid cell."""

    validate_rule_grid(grid)
    left = one_hot(first)
    right = one_hot(second)
    selected: list[Any] = []
    for row_index, left_value in enumerate(left):
        if left_value == 0.0:
            continue
        for column_index, right_value in enumerate(right):
            if right_value == 1.0:
                selected.append(grid[row_index][column_index])
    if len(selected) != 1:
        raise AssertionError("one-hot bilinear lookup did not select exactly one cell")
    return selected[0]


def vector_matrix(vector: Sequence[float], matrix: Matrix) -> Vector:
    """Multiply a row vector by a matrix represented as rows."""

    if not matrix or len(vector) != len(matrix):
        raise ValueError("vector width must match matrix row count")
    column_count = len(matrix[0])
    if any(len(row) != column_count for row in matrix):
        raise ValueError("matrix rows must have equal length")
    return [
        sum(vector[row] * matrix[row][column] for row in range(len(vector)))
        for column in range(column_count)
    ]


def dot(left: Sequence[float], right: Sequence[float]) -> float:
    """Return the inner product of equal-width vectors."""

    if len(left) != len(right):
        raise ValueError("dot-product vectors must have the same width")
    return sum(a * b for a, b in zip(left, right))


def stable_softmax(values: Sequence[float]) -> Vector:
    """Numerically stable softmax for one attention-score row."""

    if not values:
        raise ValueError("softmax requires at least one value")
    maximum = max(values)
    exponentials = [math.exp(value - maximum) for value in values]
    normalizer = sum(exponentials)
    return [value / normalizer for value in exponentials]


def attention_demo(
    observations: Sequence[Observation], temperature: float = 1.0
) -> dict[str, Any]:
    """Run a tiny, fixed-weight self-attention example over two feature rows."""

    if len(observations) != 2:
        raise ValueError("this demonstration expects exactly two observations")
    if temperature <= 0.0:
        raise ValueError("temperature must be greater than zero")

    # Fixed matrices make the result reproducible and inspectable. They are not
    # trained weights and carry no interpretive or religious significance.
    w_query: Matrix = [[0.80, -0.20], [0.35, 0.70], [-0.45, 0.30]]
    w_key: Matrix = [[0.55, 0.50], [-0.25, 0.80], [0.60, -0.15]]
    w_value: Matrix = [[0.70, 0.15], [0.10, 0.90], [-0.20, 0.45]]

    x = [list(observation.features) for observation in observations]
    query = [vector_matrix(row, w_query) for row in x]
    key = [vector_matrix(row, w_key) for row in x]
    value = [vector_matrix(row, w_value) for row in x]
    scale = math.sqrt(len(query[0])) * temperature
    scores = [[dot(q_row, k_row) / scale for k_row in key] for q_row in query]
    weights = [stable_softmax(row) for row in scores]
    context = [
        [
            sum(weights[row][source] * value[source][dimension] for source in range(2))
            for dimension in range(len(value[0]))
        ]
        for row in range(2)
    ]
    return {
        "input_features": x,
        "W_Q": w_query,
        "W_K": w_key,
        "W_V": w_value,
        "Q": query,
        "K": key,
        "V": value,
        "scores": scores,
        "weights": weights,
        "context": context,
        "temperature": temperature,
    }


def rounded(value: Any, digits: int = 6) -> Any:
    """Recursively round floats for legible JSON and terminal output."""

    if isinstance(value, float):
        return round(value, digits)
    if isinstance(value, list):
        return [rounded(item, digits) for item in value]
    if isinstance(value, dict):
        return {key: rounded(item, digits) for key, item in value.items()}
    return value


def load_grid(path: Path) -> list[list[Any]]:
    """Load a caller-supplied public, authorized rule grid from JSON."""

    with path.open("r", encoding="utf-8") as handle:
        return validate_rule_grid(json.load(handle))


def build_result(args: argparse.Namespace) -> dict[str, Any]:
    """Construct the complete, machine-readable demonstration record."""

    if args.seed is None:
        # SystemRandom has no deterministic seed; record that fact explicitly.
        rng: random.Random = secrets.SystemRandom()
        seed_label: int | str = "system-random"
    else:
        rng = random.Random(args.seed)
        seed_label = args.seed

    bits_a = args.bits_a or simulate_bits(args.probability_one, rng)
    bits_b = args.bits_b or simulate_bits(args.probability_one, rng)
    first = describe(bits_a)
    second = describe(bits_b)
    count_address = ordered_count_address(first.one_count, second.one_count)
    attention = attention_demo([first, second], args.temperature)

    result: dict[str, Any] = {
        "disclosure": (
            "Educational neutral-state simulation only; no sign, verse, polarity, "
            "offering, remedy, spiritual diagnosis, or religious authority is produced."
        ),
        "simulation": {
            "seed": seed_label,
            "bernoulli_probability_one": args.probability_one,
            "caution": "Independent Bernoulli bits are not a physical-shell calibration model.",
        },
        "record_a": asdict(first),
        "record_b": asdict(second),
        "count_pair": {
            "ordered_pair": [first.one_count, second.one_count],
            "space": "17 x 17",
            "cardinality": 289,
            "address": count_address,
            "decoded_address": list(decode_count_address(count_address)),
        },
        "attention_demo": attention,
        "non_equivalence": [
            "A count-pair address selects one discrete cell; attention computes dense row-normalized mixtures.",
            "Q, K, and V are learned linear projections for every position, not names for two throws and guidance.",
            "A 16 x 16 table is valid only after a source-governed mapping to sixteen categories is declared.",
        ],
    }

    categories_supplied = args.category_a is not None or args.category_b is not None
    if categories_supplied:
        if args.category_a is None or args.category_b is None:
            raise ValueError("category-a and category-b must be supplied together")
        pair: dict[str, Any] = {
            "ordered_categories": [args.category_a, args.category_b],
            "space": "16 x 16",
            "cardinality": 256,
            "address": args.category_a * 16 + args.category_b,
            "rule_result": None,
        }
        if args.rule_grid:
            grid = load_grid(args.rule_grid)
            pair["rule_result"] = bilinear_lookup(
                grid, args.category_a, args.category_b
            )
            pair["rule_grid"] = str(args.rule_grid)
        else:
            pair["note"] = (
                "No rule grid supplied, so the program reports an address only and "
                "does not invent an interpretation."
            )
        result["sixteen_category_pair"] = pair

    return rounded(result)


def self_test() -> None:
    """Run invariants covering serialization, lookup, and attention normalization."""

    for first in range(17):
        for second in range(17):
            address = ordered_count_address(first, second)
            assert decode_count_address(address) == (first, second)

    grid = [[f"cell-{row}-{column}" for column in range(16)] for row in range(16)]
    for row in range(16):
        for column in range(16):
            assert bilinear_lookup(grid, row, column) == f"cell-{row}-{column}"

    observation_a = describe(parse_bits("1111000011110000"))
    observation_b = describe(parse_bits("1010101010101010"))
    result = attention_demo([observation_a, observation_b])
    assert all(math.isclose(sum(row), 1.0, abs_tol=1e-12) for row in result["weights"])
    assert observation_a.one_count == 8
    assert observation_b.transitions == 15
    print("Self-test passed: 289 count pairs, 256 lookup cells, and attention row sums verified.")


def parser() -> argparse.ArgumentParser:
    """Build the command-line interface."""

    argument_parser = argparse.ArgumentParser(
        description=(
            "Compare a neutral ordered-pair matrix with a tiny Transformer-style "
            "attention calculation. This is not a divination engine."
        )
    )
    argument_parser.add_argument("--bits-a", type=parse_bits, help="sixteen 0/1 states for record A")
    argument_parser.add_argument("--bits-b", type=parse_bits, help="sixteen 0/1 states for record B")
    argument_parser.add_argument("--seed", type=int, help="deterministic simulation seed")
    argument_parser.add_argument(
        "--probability-one",
        type=float,
        default=0.5,
        help="Bernoulli simulation probability for state 1 (default: 0.5)",
    )
    argument_parser.add_argument(
        "--temperature", type=float, default=1.0, help="positive attention-score temperature"
    )
    argument_parser.add_argument(
        "--category-a", type=int, choices=range(16), metavar="0..15",
        help="optional externally mapped sixteen-category index for A",
    )
    argument_parser.add_argument(
        "--category-b", type=int, choices=range(16), metavar="0..15",
        help="optional externally mapped sixteen-category index for B",
    )
    argument_parser.add_argument(
        "--rule-grid", type=Path,
        help="optional authorized public 16-by-16 JSON grid; no grid is bundled",
    )
    argument_parser.add_argument("--json", action="store_true", help="print compact JSON")
    argument_parser.add_argument("--self-test", action="store_true", help="run invariants and exit")
    return argument_parser


def main() -> int:
    """Command-line entry point."""

    args = parser().parse_args()
    if args.self_test:
        self_test()
        return 0

    try:
        result = build_result(args)
    except (OSError, ValueError, json.JSONDecodeError) as error:
        raise SystemExit(f"error: {error}") from error

    if args.json:
        print(json.dumps(result, ensure_ascii=False, separators=(",", ":")))
    else:
        print(json.dumps(result, ensure_ascii=False, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
