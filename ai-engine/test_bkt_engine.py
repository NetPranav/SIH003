"""
Unit tests for Bayesian Knowledge Tracing & DCDA Engine
"""

import pytest
from bkt_dcda_engine import BayesianKnowledgeTracing, DCDAEngine


def test_bkt_update_correct():
    bkt = BayesianKnowledgeTracing()
    prior = 0.5
    updated = bkt.update(prior, is_correct=True)
    assert updated > prior  # Competence should increase upon correct attempt


def test_bkt_update_incorrect():
    bkt = BayesianKnowledgeTracing()
    prior = 0.5
    updated = bkt.update(prior, is_correct=False)
    assert updated < prior  # Competence should decrease upon error


def test_dcda_level_progression():
    dcda = DCDAEngine()
    # High competence & low reaction time should bump level
    next_lvl, _ = dcda.calculate_next_level(
        current_level=2, p_mastery=0.92, reaction_time_ms=750.0
    )
    assert next_lvl == 3

    # Low competence should reduce level to prevent agitation
    lower_lvl, _ = dcda.calculate_next_level(
        current_level=3, p_mastery=0.25, reaction_time_ms=2500.0
    )
    assert lower_lvl == 2


def test_mmse_5_domain_proxy():
    dcda = DCDAEngine()
    result = dcda.mmse_5_domain_proxy(
        orientation_score=4.8,
        memory_score=5.5,
        attention_score=5.8,
        executive_score=4.5,
        language_score=3.8,
    )
    assert result["total_score"] >= 24.0
    assert result["clinical_risk"] == "Low"
    assert "orientation" in result["domains"]
