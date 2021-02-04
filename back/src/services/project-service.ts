import bcrypt from 'bcrypt';
import { Project } from '../models/project';
import projectRepository from '../repositories/project.repository';


class ProjectService {
    public async create(userId: number, project: Project) {
        return projectRepository.create({ ...project, ownerId: userId });
    }
}

export default new ProjectService();
