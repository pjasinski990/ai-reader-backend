import { LearningRoadmap } from '@/contexts/project/entities/learning-roadmap';

export interface Project {
    id: string;
    ownerId: string;
    title: string;
    roadmap: LearningRoadmap;
    materialIds: string[];
    conversationIds: string[];
    quizIds: string[];
}
