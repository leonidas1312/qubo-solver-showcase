import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SolverParameterInput } from "./SolverParameterInput";

interface SolverParameter {
  name: string;
  type: string;
  description?: string;
  default_value?: string;
}

interface SolverParametersProps {
  parameters: Record<string, any>;
  solverParameters: SolverParameter[];
  onParameterChange: (paramName: string, value: string) => void;
}

export const SolverParameters = ({
  parameters,
  solverParameters,
  onParameterChange,
}: SolverParametersProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Solver Parameters</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {solverParameters.map((param) => (
          <SolverParameterInput
            key={param.name}
            parameter={param}
            value={parameters[param.name] || ""}
            onChange={(value) => onParameterChange(param.name, value)}
            disabled={param.name === "qubo_matrix"}
          />
        ))}
      </CardContent>
    </Card>
  );
};