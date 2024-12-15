type exercise = {
  name: string;
  type: string;
  muscle: string;
  equipment: string
  difficulty: string;
  instructions: string;
};

export default function Exercise_Card(props:exercise)
{
    return (
         <div>
            <h2>{props.name}</h2>
            <p><strong>Type:</strong> {props.type}</p>
            <p><strong>Muscle:</strong> {props.muscle}</p>
            <p><strong>Equipment:</strong> {props.equipment}</p>
            <p><strong>Difficulty:</strong> {props.difficulty}</p>
            <p><strong>Instructions:</strong> {props.instructions}</p>
         </div>
      );    
}