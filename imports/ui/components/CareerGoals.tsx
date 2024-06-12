import {useState, useEffect} from "react";
import io from "socket.io-client";
import {GoalType} from "../types";
import Goal from "./Goal";

const CareerGoals = () => {
  // debugger;
  const [goals, setGoals] = useState<GoalType[]>([]);

  useEffect(() => {
    const socket = io("http://localhost:3001");

    socket.on("initialData", (data) => {
      console.log("Received initial data:", data);
      setGoals(data.goals);
    });

    socket.on("connect", () => {
      console.log("Connected to server");
    });

    socket.on("updateGoals", (newGoals) => {
      console.log("Received data:", newGoals);
      setGoals(newGoals);
    });

    socket.on("disconnect", () => {
      console.log("Disconnected from server");
    });

    return () => {
      socket.off("initialData");
      socket.off("updateGoals");
      socket.close();
    };
  }, []);
  return (
    <div>
      <main className="grid grid-flow-col auto-cols-max gap-4">
        {goals.map((goal, goalIndex) => (
          <Goal
            key={goalIndex}
            goal={goal.goal}
            current={goal.current}
            target={goal.target}
            unit={goal.unit}
          />
        ))}
      </main>
    </div>
  );
};

export default CareerGoals;
