import bcrypt from 'bcrypt';
import { Project } from '../models/project';
import projectRepository from '../repositories/project.repository';


class ProjectService {
    public async create(userId: number, project: Project) {
        const projectId = await projectRepository.create({ ...project, ownerId: userId });
        const [roles, users,] = await Promise.all([projectRepository.createProjectRoles(projectId, project.roles),
        projectRepository.createProjectUsers(projectId, project.users.map(user => user.id)),
        projectRepository.createProjectLinks(projectId, project.links)]);
        const projectUserRole = [];
        project.users.forEach(user => {
            const userId = users.find(u => u.userId == user.id)?.id;
            if (userId) {
                user.roles.forEach(role => {
                    const roleId = roles.find(r => r.name == role).id;
                    if (roleId) {
                        projectUserRole.push({ projectRoleId: roleId, projectUserId: userId });
                    }
                })
            }

        })
        await projectRepository.createProjectUserRoles(projectUserRole);
        return projectId;
    }
}

export default new ProjectService();
