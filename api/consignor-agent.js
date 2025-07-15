// api/workflows/consignor-agent.js

import fetch from 'node-fetch';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Only POST allowed' });
  }

  const input = req.body;
  const intent = input.intent?.toLowerCase();

  let workflowURL;

  switch (intent) {
  case "create-task":
    workflowURL = process.env.N8N_CREATE_TASK_WEBHOOK;
    break;
  case "send-message":
    workflowURL = process.env.N8N_SEND_MESSAGE_WEBHOOK;
    break;
  case "create-booking":
    workflowURL = process.env.N8N_CREATE_BOOKING_WEBHOOK;
    break;
  case "assign-vendor":
    workflowURL = process.env.N8N_ASSIGN_VENDOR_WEBHOOK;
    break;
  case "log-finance":
    workflowURL = process.env.N8N_LOG_FINANCE_WEBHOOK;
    break;
  case "generate-report":
    workflowURL = process.env.N8N_GENERATE_REPORT_WEBHOOK;
    break;
  case "check-availability":
    workflowURL = process.env.N8N_CHECK_AVAILABILITY_WEBHOOK;
    break;
  case "escalate-issue":
    workflowURL = process.env.N8N_ESCALATE_ISSUE_WEBHOOK;
    break;
  case "auto-prioritize":
    workflowURL = process.env.N8N_AUTO_PRIORITIZE_WEBHOOK;
    break;
  default:
    return res.status(400).json({ error: `Unknown intent: ${intent}` });
}

if (!workflowURL) {
  return res.status(500).json({ error: `Missing webhook URL for intent: ${intent}` });
}


  try {
    const response = await fetch(workflowURL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    });

    const result = await response.json();

    return res.status(200).json({
      success: true,
      routedTo: intent,
      result,
    });

  } catch (error) {
    console.error("Routing failed:", error);
    return res.status(500).json({ error: "Failed to call n8n workflow" });
  }
}

