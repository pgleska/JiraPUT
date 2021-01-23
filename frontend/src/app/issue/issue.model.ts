import {SelectItem} from '../common/select/select-item.model';

export type IssueTypes = 'task' | 'story' | 'epic';
export type IssueTypesName = 'Task' | 'Story' | 'Epic';
export const ISSUE_TYPES: SelectItem[] = [{id: 'task', name: 'Task'}, {id: 'story', name: 'Story'}, {id: 'epic', name: 'Epic'}];
export const TASK_TYPES: SelectItem[] = [{id: 1, name: 'Feature'}, {id: 2, name: 'Bug'}, {id: 3, name: 'Test'}];

export interface Issue {
    id: number
    name: string
    description: string,
    estimatedTime: number | Date
    realTime: number | Date
    timeDifference: number | Date
    type: IssueTypes
    typeName: IssueTypesName

    // epic
    projectId?: number
    projectName?: string
    realizationDate?: string
    stories?: number[]

    // story
    epicId?: number,
    epicName?: string
    teamName?: string
    tasks?: number[]

    // task
    storyId?: number
    storyName?: string
    userLogin?: string
    taskType?: number
}
