// ===========================================
// SILENCE.OBJECTS - Crisis Detection Tests
// ===========================================
// Test suite for 3-layer crisis detection system

import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  CrisisDetectionSystem,
  containsHardKeywords,
  containsSoftKeywords,
  shouldBlockSubmission,
  getDetectedKeywords,
} from "../src/lib/safety/crisis-detection";
import {
  HARD_KEYWORDS,
  SOFT_KEYWORDS,
  CRISIS_RESOURCES,
} from "../src/lib/constants/crisis-resources";

// Mock the Claude API for Layer 3 tests
vi.mock("../src/lib/ai/claude", () => ({
  assessCrisisLevel: vi.fn().mockResolvedValue({
    riskLevel: "LOW",
    confidence: 0.3,
    reasoning: "Context appears non-crisis",
    action: "PROCEED",
  }),
}));

describe("Crisis Detection System", () => {
  let detector: CrisisDetectionSystem;

  beforeEach(() => {
    detector = new CrisisDetectionSystem({
      enableClaudeAssessment: false, // Disable for deterministic tests
    });
  });

  // ===========================================
  // LAYER 1: HARD KEYWORD TESTS
  // ===========================================

  describe("Layer 1: Hard Keywords", () => {
    it("should detect Polish hard keywords and block immediately", async () => {
      const testCases = [
        "Myślę o samobójstwie i nie wiem co robić",
        "Chcę się zabić, nie mam siły",
        "Zamierzam odebrać sobie życie",
        "Nie chcę już żyć w tym świecie",
        "Chcę umrzeć i skończyć z tym wszystkim",
      ];

      for (const text of testCases) {
        const result = await detector.checkContent({ text });
        expect(result.blocked).toBe(true);
        expect(result.riskLevel).toBe("high");
        expect(result.action).toBe("BLOCK_MODAL");
        expect(result.layer).toBe("hard_keyword");
      }
    });

    it("should detect English hard keywords and block immediately", async () => {
      const testCases = [
        "I want to commit suicide",
        "I'm going to kill myself tonight",
        "I want to end my life now",
        "I want to die and disappear",
        "Planning to overdose on pills",
      ];

      for (const text of testCases) {
        const result = await detector.checkContent({ text });
        expect(result.blocked).toBe(true);
        expect(result.riskLevel).toBe("high");
        expect(result.action).toBe("BLOCK_MODAL");
        expect(result.layer).toBe("hard_keyword");
      }
    });

    it("should detect self-harm keywords", async () => {
      const testCases = [
        "I want to hurt myself",
        "Thinking about cutting myself",
        "Chcę się skrzywdzić",
        "Tnę się codziennie",
      ];

      for (const text of testCases) {
        const result = await detector.checkContent({ text });
        expect(result.blocked).toBe(true);
        expect(result.layer).toBe("hard_keyword");
      }
    });

    it("should handle mixed language input", async () => {
      const text = "Myślę o suicide i nie wiem co robić";
      const result = await detector.checkContent({ text });
      expect(result.blocked).toBe(true);
      expect(result.hardKeywordResult.language).toBe("mixed");
    });

    it("should be case-insensitive", async () => {
      const testCases = [
        "SAMOBÓJSTWO",
        "Samobójstwo",
        "samobójstwo",
        "SUICIDE",
        "Suicide",
        "suicide",
      ];

      for (const text of testCases) {
        const result = await detector.checkContent({ text });
        expect(result.blocked).toBe(true);
      }
    });

    it("should detect keywords within longer text", async () => {
      const text =
        "Dzisiaj miałem trudny dzień w pracy. Mój szef był bardzo wymagający. Czasem myślę o samobójstwie gdy jest ciężko. Mam nadzieję że jutro będzie lepiej.";
      const result = await detector.checkContent({ text });
      expect(result.blocked).toBe(true);
      expect(result.hardKeywordResult.keywords).toContain("samobójstwie");
    });
  });

  // ===========================================
  // LAYER 2: SOFT KEYWORD TESTS
  // ===========================================

  describe("Layer 2: Soft Keywords", () => {
    it("should detect Polish soft keywords without blocking", async () => {
      const testCases = [
        "Czuję się beznadziejnie ostatnio",
        "Samotność mnie przytłacza",
        "Mam wrażenie że życie nie ma sensu",
        "Jestem pusty w środku",
      ];

      for (const text of testCases) {
        const result = await detector.checkContent({ text });
        expect(result.blocked).toBe(false);
        expect(result.riskLevel).toBe("low");
        expect(result.action).toBe("SHOW_BANNER");
        expect(result.layer).toBe("soft_keyword");
      }
    });

    it("should detect English soft keywords without blocking", async () => {
      const testCases = [
        "I feel so hopeless right now",
        "Feeling alone and worthless",
        "Everything feels pointless",
        "I'm empty inside and numb",
      ];

      for (const text of testCases) {
        const result = await detector.checkContent({ text });
        expect(result.blocked).toBe(false);
        expect(result.riskLevel).toBe("low");
        expect(result.action).toBe("SHOW_BANNER");
      }
    });

    it("should count multiple soft keywords", async () => {
      const text = "I feel hopeless, worthless, and completely alone. Everything is pointless.";
      const result = await detector.checkContent({ text });
      expect(result.softKeywordResult.count).toBeGreaterThan(1);
      expect(result.softKeywordResult.keywords.length).toBeGreaterThan(1);
    });

    it("should prioritize hard keywords over soft keywords", async () => {
      const text = "I feel hopeless and I want to kill myself";
      const result = await detector.checkContent({ text });
      expect(result.blocked).toBe(true);
      expect(result.layer).toBe("hard_keyword");
      expect(result.riskLevel).toBe("high");
    });
  });

  // ===========================================
  // NO CRISIS CONTENT TESTS
  // ===========================================

  describe("No Crisis Content", () => {
    it("should allow normal content to proceed", async () => {
      const testCases = [
        "Dzisiaj był dobry dzień w pracy",
        "Spotkałem się ze znajomymi na kawę",
        "Mam konflikt z kolegą w zespole",
        "I had a productive meeting today",
        "The weather was nice for a walk",
        "My project deadline is approaching",
      ];

      for (const text of testCases) {
        const result = await detector.checkContent({ text });
        expect(result.blocked).toBe(false);
        expect(result.riskLevel).toBe("none");
        expect(result.action).toBe("PROCEED");
        expect(result.layer).toBe("none");
      }
    });

    it("should not flag similar but non-crisis words", async () => {
      const testCases = [
        "The project is killing my schedule", // 'killing' in non-crisis context
        "I'm dying to see the new movie", // 'dying' as expression
        "That joke killed me", // slang usage
        "Zabijam czas grając w gry", // killing time
      ];

      for (const text of testCases) {
        const result = await detector.checkContent({ text });
        // These should be handled carefully - some may trigger soft keywords
        // but hard keywords for methods should not trigger
        expect(result.layer).not.toBe("hard_keyword");
      }
    });
  });

  // ===========================================
  // CRISIS RESOURCES TESTS
  // ===========================================

  describe("Crisis Resources", () => {
    it("should include Polish resources for PL locale", async () => {
      const text = "Chcę się zabić";
      const result = await detector.checkContent({ text, locale: "PL" });
      expect(result.resources).toBeDefined();
      expect(result.resources?.region).toBe("PL");
      expect(result.resources?.primary.number).toBe("116 123");
    });

    it("should include UK resources for UK locale", async () => {
      const text = "I want to kill myself";
      const result = await detector.checkContent({ text, locale: "UK" });
      expect(result.resources).toBeDefined();
      expect(result.resources?.region).toBe("UK");
      expect(result.resources?.primary.name).toContain("Samaritans");
    });

    it("should include US resources for US locale", async () => {
      const text = "I want to end my life";
      const result = await detector.checkContent({ text, locale: "US" });
      expect(result.resources).toBeDefined();
      expect(result.resources?.region).toBe("US");
      expect(result.resources?.primary.number).toBe("988");
    });

    it("should not include resources for non-crisis content", async () => {
      const text = "Today was a good day at work";
      const result = await detector.checkContent({ text });
      expect(result.resources).toBeUndefined();
    });
  });

  // ===========================================
  // CONVENIENCE FUNCTION TESTS
  // ===========================================

  describe("Convenience Functions", () => {
    describe("containsHardKeywords", () => {
      it("should return true for hard keywords", () => {
        expect(containsHardKeywords("samobójstwo")).toBe(true);
        expect(containsHardKeywords("kill myself")).toBe(true);
        expect(containsHardKeywords("chcę umrzeć")).toBe(true);
      });

      it("should return false for soft keywords only", () => {
        expect(containsHardKeywords("hopeless")).toBe(false);
        expect(containsHardKeywords("beznadziejnie")).toBe(false);
      });

      it("should return false for normal text", () => {
        expect(containsHardKeywords("good morning")).toBe(false);
        expect(containsHardKeywords("dzień dobry")).toBe(false);
      });
    });

    describe("containsSoftKeywords", () => {
      it("should return true for soft keywords", () => {
        expect(containsSoftKeywords("hopeless")).toBe(true);
        expect(containsSoftKeywords("beznadziejnie")).toBe(true);
        expect(containsSoftKeywords("samotność")).toBe(true);
      });

      it("should return false for normal text", () => {
        expect(containsSoftKeywords("good morning")).toBe(false);
      });
    });

    describe("shouldBlockSubmission", () => {
      it("should return true only for hard keywords", () => {
        expect(shouldBlockSubmission("samobójstwo")).toBe(true);
        expect(shouldBlockSubmission("kill myself")).toBe(true);
        expect(shouldBlockSubmission("hopeless")).toBe(false);
        expect(shouldBlockSubmission("good day")).toBe(false);
      });
    });

    describe("getDetectedKeywords", () => {
      it("should return categorized keywords", () => {
        const result = getDetectedKeywords("I feel hopeless and want to kill myself");
        expect(result.hard).toContain("kill myself");
        expect(result.soft).toContain("hopeless");
      });

      it("should return empty arrays for clean text", () => {
        const result = getDetectedKeywords("Today was a great day");
        expect(result.hard).toHaveLength(0);
        expect(result.soft).toHaveLength(0);
      });
    });
  });

  // ===========================================
  // PERFORMANCE TESTS
  // ===========================================

  describe("Performance", () => {
    it("should process hard keywords in under 50ms", async () => {
      const text = "Myślę o samobójstwie";
      const result = await detector.checkContent({ text });
      expect(result.processingTimeMs).toBeLessThan(50);
    });

    it("should process soft keywords in under 50ms (without Claude)", async () => {
      const text = "Czuję się beznadziejnie";
      const result = await detector.checkContent({ text });
      expect(result.processingTimeMs).toBeLessThan(50);
    });

    it("should process clean text in under 50ms", async () => {
      const text = "Dzisiaj był dobry dzień w pracy i wszystko poszło zgodnie z planem.";
      const result = await detector.checkContent({ text });
      expect(result.processingTimeMs).toBeLessThan(50);
    });

    it("should handle long text efficiently", async () => {
      const text = "Lorem ipsum ".repeat(500); // ~6000 chars
      const result = await detector.checkContent({ text });
      expect(result.processingTimeMs).toBeLessThan(100);
    });
  });

  // ===========================================
  // KEYWORD COVERAGE TESTS
  // ===========================================

  describe("Keyword Coverage", () => {
    it("should have comprehensive Polish hard keywords", () => {
      const polishKeywords = HARD_KEYWORDS.filter((k) => /[ąćęłńóśźżĄĆĘŁŃÓŚŹŻ]/.test(k));
      expect(polishKeywords.length).toBeGreaterThan(20);
    });

    it("should have comprehensive English hard keywords", () => {
      const englishKeywords = HARD_KEYWORDS.filter((k) => !/[ąćęłńóśźżĄĆĘŁŃÓŚŹŻ]/.test(k));
      expect(englishKeywords.length).toBeGreaterThan(20);
    });

    it("should have comprehensive Polish soft keywords", () => {
      const polishKeywords = SOFT_KEYWORDS.filter((k) => /[ąćęłńóśźżĄĆĘŁŃÓŚŹŻ]/.test(k));
      expect(polishKeywords.length).toBeGreaterThan(30);
    });

    it("should have comprehensive English soft keywords", () => {
      const englishKeywords = SOFT_KEYWORDS.filter((k) => !/[ąćęłńóśźżĄĆĘŁŃÓŚŹŻ]/.test(k));
      expect(englishKeywords.length).toBeGreaterThan(30);
    });
  });

  // ===========================================
  // CRISIS RESOURCES VALIDATION
  // ===========================================

  describe("Crisis Resources Validation", () => {
    it("should have valid PL resources", () => {
      const pl = CRISIS_RESOURCES.PL;
      expect(pl.primary.number).toBeTruthy();
      expect(pl.secondary.number).toBeTruthy();
      expect(pl.primary.available).toBe("24/7");
    });

    it("should have valid UK resources", () => {
      const uk = CRISIS_RESOURCES.UK;
      expect(uk.primary.number).toBe("116 123");
      expect(uk.secondary.number).toBe("999");
    });

    it("should have valid US resources", () => {
      const us = CRISIS_RESOURCES.US;
      expect(us.primary.number).toBe("988");
      expect(us.secondary.number).toBe("911");
    });

    it("should have valid EU fallback resources", () => {
      const eu = CRISIS_RESOURCES.EU;
      expect(eu.primary.number).toBe("112");
    });
  });
});

// ===========================================
// LAYER 3: CLAUDE ASSESSMENT TESTS
// ===========================================

describe("Layer 3: Claude Assessment (Mocked)", () => {
  it("should call Claude for soft keywords when enabled", async () => {
    const { assessCrisisLevel } = await import("../src/lib/ai/claude");
    const detector = new CrisisDetectionSystem({
      enableClaudeAssessment: true,
    });

    const text = "I feel so hopeless and empty inside";
    await detector.checkContent({ text });

    expect(assessCrisisLevel).toHaveBeenCalled();
  });
});
