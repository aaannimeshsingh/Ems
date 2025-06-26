import React from 'react'
import AcceptTask from './AcceptTask'
import NewTask from './NewTask'
import CompleteTask from './CompleteTask'
import FailedTask from './FailedTask'

const TaskList = ({ data, onTaskUpdate }) => {
  if (!data || !data.tasks) return null;

  const handleAcceptTask = (task) => {
    onTaskUpdate(task, 'accept');
  };

  const handleMarkCompleted = (task) => {
    onTaskUpdate(task, 'complete');
  };

  const handleMarkFailed = (task) => {
    onTaskUpdate(task, 'fail');
  };

  return (
    <div id='tasklist' className='h-[55%] flex overflow-x-auto items-center justify-start w-full py-5 gap-5 flex-nowrap mt-10'>
      {data.tasks.map((elem, idx) => {
        if (elem.active) {
          return (
            <AcceptTask 
              key={idx} 
              data={elem} 
              onMarkCompleted={handleMarkCompleted}
              onMarkFailed={handleMarkFailed}
            />
          )
        }
        if (elem.newTask) {
          return (
            <NewTask 
              key={idx} 
              data={elem}
              onAcceptTask={handleAcceptTask}
            />
          )
        }
        if (elem.completed) {
          return <CompleteTask key={idx} data={elem} />
        }
        if (elem.failed) {
          return <FailedTask key={idx} data={elem} />
        }
        return null;
      })}
    </div>
  )
}

export default TaskList