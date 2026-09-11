def normalize_factor(value: float, min_val: float = 0.0, max_val: float = 1.0) -> float:
    if max_val <= min_val:
        return 0.0
    scaled = (value - min_val) / (max_val - min_val)
    return max(0.0, min(1.0, scaled))
