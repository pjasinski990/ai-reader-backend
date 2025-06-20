import { LearningCheckpoint } from './learning-checkpoint';

export interface LearningRoadmap {
    id: string;
    title: string;
    checkpoints: LearningCheckpoint[];
}
