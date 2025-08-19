import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Mail, FileText, MessageCircle, Briefcase, Play, CheckCircle } from 'lucide-react';

interface DemoScenario {
  id: string;
  title: string;
  icon: React.ReactNode;
  description: string;
  steps: string[];
  sampleInput: string;
  expectedOutput: string;
}

export const DemoWorkflows = () => {
  const [activeDemo, setActiveDemo] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [demoInput, setDemoInput] = useState('');
  const [demoOutput, setDemoOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const { toast } = useToast();

  const demoScenarios: DemoScenario[] = [
    {
      id: 'email-draft',
      title: 'Email Draft Assistant',
      icon: <Mail className="h-5 w-5" />,
      description: 'Transform casual notes into professional emails',
      steps: [
        'Select rough email notes',
        'Press Ctrl+Space to activate AI',
        'Choose "Professional Email" prompt',
        'Review and copy polished email'
      ],
      sampleInput: 'hey john, need those reports by friday for the client meeting. also can you cc sarah? thanks',
      expectedOutput: `Subject: Request for Reports - Client Meeting Preparation

Dear John,

I hope this email finds you well. I wanted to reach out regarding the upcoming client meeting scheduled for Friday.

Could you please provide the necessary reports by Friday? These will be essential for our client presentation. Additionally, please ensure that Sarah is CC'd on all related communications.

Thank you for your assistance with this matter.

Best regards,
[Your Name]`
    },
    {
      id: 'meeting-notes',
      title: 'Meeting Notes Processor',
      icon: <FileText className="h-5 w-5" />,
      description: 'Convert messy meeting notes into structured summaries',
      steps: [
        'Paste or type meeting notes',
        'Activate AI with Ctrl+Space',
        'Select "Summarize Meeting" prompt',
        'Get organized action items and summary'
      ],
      sampleInput: 'discussed q4 budget, need to increase marketing spend by 20%, sarah will handle social media campaign, john reviewing vendor contracts, deadline next tuesday, also talked about hiring 2 new developers',
      expectedOutput: `# Meeting Summary

## Key Decisions
- Increase Q4 marketing budget by 20%
- Approve hiring of 2 new developers

## Action Items
- **Sarah**: Handle social media campaign
- **John**: Review vendor contracts (Due: Next Tuesday)

## Discussion Points
- Q4 budget allocation reviewed
- Marketing spend increase approved
- Development team expansion planned`
    },
    {
      id: 'content-adaptation',
      title: 'Content Adaptation',
      icon: <MessageCircle className="h-5 w-5" />,
      description: 'Adapt content for different platforms and audiences',
      steps: [
        'Input original content',
        'Trigger AI assistant',
        'Choose target platform/tone',
        'Receive adapted version'
      ],
      sampleInput: 'We are excited to announce our new AI-powered analytics dashboard that helps businesses make data-driven decisions faster than ever before.',
      expectedOutput: `🚀 JUST LAUNCHED: Our game-changing AI analytics dashboard! 

📊 Make data-driven decisions at lightning speed
🎯 Perfect for businesses ready to level up
💡 Turn insights into action instantly

Who's ready to transform their decision-making process? 

#Analytics #AI #DataDriven #BusinessIntelligence`
    },
    {
      id: 'document-review',
      title: 'Document Review',
      icon: <Briefcase className="h-5 w-5" />,
      description: 'Review and improve document clarity and tone',
      steps: [
        'Select document section',
        'Open AI assistant',
        'Choose "Review & Improve" prompt',
        'Apply suggested improvements'
      ],
      sampleInput: 'The implementation of this solution will help to make things better for users and we think it will be good for business outcomes too.',
      expectedOutput: `The implementation of this solution will significantly enhance user experience while driving measurable business outcomes. Our analysis indicates improved operational efficiency and increased customer satisfaction rates.

**Suggested improvements:**
- Replace vague terms with specific metrics
- Add quantifiable benefits
- Strengthen professional tone
- Include measurable outcomes`
    }
  ];

  const runDemo = async (scenario: DemoScenario) => {
    setActiveDemo(scenario.id);
    setCurrentStep(0);
    setDemoInput(scenario.sampleInput);
    setDemoOutput('');
    setIsRunning(true);

    // Simulate step-by-step execution
    for (let i = 0; i < scenario.steps.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setCurrentStep(i + 1);
      
      if (i === scenario.steps.length - 1) {
        setDemoOutput(scenario.expectedOutput);
      }
    }

    setIsRunning(false);
    toast({
      title: "Demo Complete",
      description: `${scenario.title} workflow demonstrated successfully`
    });
  };

  const copyOutput = () => {
    navigator.clipboard.writeText(demoOutput);
    toast({
      title: "Copied",
      description: "Output copied to clipboard"
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Play className="h-5 w-5 text-primary" />
            Demo Workflows
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {demoScenarios.map((scenario) => (
              <Card 
                key={scenario.id} 
                className={`cursor-pointer transition-all ${
                  activeDemo === scenario.id ? 'ring-2 ring-primary' : 'hover:shadow-md'
                }`}
                onClick={() => !isRunning && runDemo(scenario)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      {scenario.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium mb-1">{scenario.title}</h3>
                      <p className="text-sm text-muted-foreground mb-3">
                        {scenario.description}
                      </p>
                      <div className="space-y-1">
                        {scenario.steps.map((step, index) => (
                          <div 
                            key={index}
                            className={`flex items-center gap-2 text-xs ${
                              activeDemo === scenario.id && currentStep > index
                                ? 'text-primary'
                                : 'text-muted-foreground'
                            }`}
                          >
                            {activeDemo === scenario.id && currentStep > index ? (
                              <CheckCircle className="h-3 w-3" />
                            ) : (
                              <div className="h-3 w-3 rounded-full border border-current" />
                            )}
                            {step}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {activeDemo && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-medium">Demo in Progress</h3>
                <Badge variant={isRunning ? "default" : "secondary"}>
                  {isRunning ? 'Running...' : 'Complete'}
                </Badge>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Input</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Textarea
                      value={demoInput}
                      onChange={(e) => setDemoInput(e.target.value)}
                      rows={4}
                      className="text-sm"
                    />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm flex items-center justify-between">
                      Output
                      {demoOutput && (
                        <Button size="sm" variant="ghost" onClick={copyOutput}>
                          Copy
                        </Button>
                      )}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {demoOutput ? (
                      <div className="p-3 bg-muted rounded-md text-sm whitespace-pre-wrap">
                        {demoOutput}
                      </div>
                    ) : (
                      <div className="p-3 border-2 border-dashed border-muted-foreground/25 rounded-md text-center text-muted-foreground text-sm">
                        {isRunning ? 'Processing...' : 'Output will appear here'}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};