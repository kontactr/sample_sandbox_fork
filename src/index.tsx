import * as React from "react";
import { render } from "react-dom";
import {
  observable,
  computed,
  autorun,
} from "mobx";
import { observer } from "mobx-react";

interface Task {
  text: string;
  done: boolean;
}

interface TaskProps {
  task: Task;
  onDelete(): void;
}

const Task = observer(
  ({ task, onDelete }: TaskProps) => (
    <div className="task">
      <input
        type="checkbox"
        checked={task.done}
        onChange={() => (task.done = !task.done)}
      />
      <span>{task.text}</span>
      <button onClick={onDelete}>Deletar</button>
    </div>
  ),
);

const defaultTasks: Task[] = [
  {
    text: "Complete essa task",
    done: false,
  },
];

@observer
class App extends React.Component {
  @observable tasks: Task[];

  @observable newTask = "";

  constructor() {
    super({});

    try {
      this.tasks =
        JSON.parse(
          localStorage.getItem("tasks")!,
        ) || defaultTasks;
    } catch (err) {
      this.tasks = defaultTasks;
    }

    autorun(() =>
      localStorage.setItem(
        "tasks",
        JSON.stringify(this.tasks),
      ),
    );
  }

  private createTask = (
    ev: React.FormEvent<any>,
  ) => {
    ev.preventDefault();

    if (!this.newTask.trim()) return;

    this.tasks.push({
      text: this.newTask.trim(),
      done: false,
    });

    this.newTask = "";
  };

  private onDelete = (i: number) => () => {
    this.tasks = this.tasks.filter(
      (_, index) => index !== i,
    );
  };

  @computed
  private get todoCount() {
    return this.tasks.filter(t => !t.done).length;
  }

  public render() {
    return (
      <div className="wrapper">
        <h1>Tarefas</h1>
        <div className="center">
          {this.todoCount === 0
            ? "Nada a fazer"
            : this.todoCount === 1
            ? "1 tarefa a fazer"
            : `${this.todoCount} tarefas a fazer`}
        </div>
        <div className="tasks">
          <form
            className="task"
            onSubmit={this.createTask}
          >
            <span />
            <input
              value={this.newTask}
              onChange={ev =>
                (this.newTask = ev.target.value)
              }
            />
            <button>Criar</button>
          </form>
          {this.tasks.map((task, i) => (
            <Task
              key={i}
              task={task}
              onDelete={this.onDelete(i)}
            />
          ))}
        </div>
      </div>
    );
  }
}

let t = <App />;
console.log(new t.type().render(), 50);

render(<App />, document.getElementById("root"));
