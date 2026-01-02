export const containsAdviceRequest = (message) => {
  return /advice|recommend|should I|can I|my case|my situation/i.test(message);
};

export const buildAssistantResponse = ({ message, citations }) => {
  const adviceRequested = containsAdviceRequest(message);

  return [
    "Here is a general, citation-based response:",
    adviceRequested
      ? "I can provide general legal information only. For case-specific advice, consult a licensed lawyer."
      : "This is a high-level informational overview based on the cited provisions.",
    "",
    "Key takeaways:",
    "- Review the official text for exact wording.",
    "- Confirm applicability and exceptions in related regulations.",
    "- Maintain documentation aligned with compliance requirements.",
    "",
    citations.length ? `Citations: ${citations.join(" ")}` : "Citations: None provided.",
    "",
    "Informational legal research tool. Not legal advice.",
  ].join("\n");
};
