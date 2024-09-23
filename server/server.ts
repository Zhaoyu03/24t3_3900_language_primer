import express, { Request, Response } from 'express';
import cors from 'cors';


// NOTE: you may modify these interfaces
interface Student {
  id: number;
  name: string;
}

interface GroupSummary {
  id: number;
  groupName: string;
  members: number[];
}

interface Group {
  id: number;
  groupName: string;
  members: Student[];
}
class Groups {
  groups: Group[];
  groupId: number;
  studentId: number;

  constructor() {
    this.groups = [];
    this.groupId = 0;
    this.studentId = 0;
  }
  /**
   * Return a group object
   * 
   */
  getGroup(id: number): Group | undefined {
    return this.groups.find(group => group.id == id)
  }
   /**
   * Return a group summary
   * 
   */
  getAllGroupSummary(): GroupSummary[] {
    return this.groups.map(this.createGroupSummary);
  }

  getAllStudents(): Student[] {
    return this.groups.flatMap((group) => group.members);
  }

  createGroupSummary(group: Group): GroupSummary {
    return {
      id: group.id,
      groupName: group.groupName,
      members: group.members.map((student) => student.id),
    };
  }

  createGroup(groupName: string, members: string[]): GroupSummary {
    const newGroup: Group = {
      id: this.groupId++,
      groupName,
      members: members.map(this.createStudent, this),
    };
    this.groups.push(newGroup);
    return this.createGroupSummary(newGroup);
  }

  createStudent(name: string): Student {
    return {
      id: this.studentId++,
      name,
    };
  }
  deleteGroup(id: number): boolean {
    const index = this.groups.findIndex(group => group.id == id);;
    if (index != -1) {
      this.groups.splice(index, 1);
      return true;
    }
    return false;
  }
}  
function is_invalid_name(name: string): boolean {
  name = name.trim();
 if (name.length > 0 && name.match(/^[a-zA-Z0-9 ]+$/)){
  return true;
 }
return false;
}

const app = express();
const port = 3902;

app.use(cors());
app.use(express.json());

const allGroups = new Groups();
////////////////////////////////////////////////////////////////////////////////

/**
 * Route to get all groups
 * @route GET /api/groups
 * @returns {Array} - Array of group objects
 */
app.get('/api/groups', (req: Request, res: Response) => {
  // TODO: (sample response below)
  // const groupSummaries: GroupSummary[] = groups.map(group => ({
  //   id: group.id,
  //   groupName: group.groupName,
  //   members: group.members.map(member => member.id),
  // }));
  res.json(allGroups.getAllGroupSummary());
});

/**
 * Route to get all students
 * @route GET /api/students
 * @returns {Array} - Array of student objects
 */
app.get('/api/students', (req: Request, res: Response) => {
  // TODO: (sample response below)
  res.json(allGroups.getAllStudents());
});

/**
 * Route to add a new group
 * @route POST /api/groups
 * @param {string} req.body.groupName - The name of the group
 * @param {Array} req.body.members - Array of member names
 * @returns {Object} - The created group object
 */
app.post('/api/groups', (req: Request, res: Response) => {
  // TODO: implement storage of a new group and return their info (sample response below)
  const { groupName, members } = req.body;
  if (members.length == 0) {
    res.status(400).send("Group con not be empty!")
    return;
  }
  //TODO: edge Case
  // for (const name of [groupName].concat(members)) {
  //   if (name == null) {
  //     res.status(400).send('cannot be empty')
  //     return;
  //   }
  //   if (is_invalid_name(name)) {
  //     res.status(400).send('invalid name');
  //     return;
  //   }
  // }
  res.json(allGroups.createGroup(groupName, members));
 
});

/**
 * Route to delete a group by ID
 * @route DELETE /api/groups/:id
 * @param {number} req.params.id - The ID of the group to delete
 * @returns {void} - Empty response with status code 204
 */
app.delete('/api/groups/:id', (req: Request, res: Response) => {
  // TODO: (delete the group with the specified id)
  const id = parseInt(req.params.id);

  const group = allGroups.getGroup(id);
  if (group == undefined) {
    res.status(404).send('group not foud')
    return
  }

  if (!allGroups.deleteGroup(id)) {
    res.status(500).send('could not delete')
    return
  }

  res.sendStatus(204); // send back a 204 (do not modify this line)
});

/**
 * Route to get a group by ID (for fetching group members)
 * @route GET /api/groups/:id
 * @param {number} req.params.id - The ID of the group to retrieve
 * @returns {Object} - The group object with member details
 */
app.get('/api/groups/:id', (req: Request, res: Response) => {
  // TODO: (sample response below)
  const id = parseInt(req.params.id);

  const group = allGroups.getGroup(id);
  if (group == undefined) {
    res.status(404).send('group not found');
    return;
  }

  res.json(group);

  /* TODO:
   * if (group id isn't valid) {
   *   res.status(404).send("Group not found");
   * }
   */
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
