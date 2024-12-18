type exercise = {
  name: string;
  type: string;
  muscle: string;
  equipment: string;
  difficulty: string;
  instructions: string;
};

export default function Exercise_Card(props: exercise) {
  return (
    <div className="exercise-card-container">
      <div className="exercise-card-header">
        <h2>{props.name}</h2>
      </div>
      <div className="exercise-card-info">
        <p>
          <strong>Type:</strong> {props.type}
        </p>
        <p>
          <strong>Muscle:</strong> {props.muscle}
        </p>
        <p>
          <strong>Equipment:</strong> {props.equipment}
        </p>
        <p>
          <strong>Difficulty:</strong> {props.difficulty}
        </p>
        <div className="exercise-card-instructions">
          <strong>Instructions:</strong>
          <p>{props.instructions}</p>
        </div>
      </div>
    </div>
  );
}
