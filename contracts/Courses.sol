pragma solidity ^0.4.24;

import "@aragon/os/contracts/apps/AragonApp.sol";
import "@aragon/os/contracts/lib/math/SafeMath.sol";

contract Courses is AragonApp {
    //EVENTS
    event CreateUser(address indexed entity, string name, string email);
    event DeleteUser(address indexed entity, uint id);
    event UpdateUser(address indexed entity, uint id, string name, string email);
    event SetUserReputation(
        address indexed entity,
        uint id,
        uint reputation
    );
   // event GetUser(address indexed entity);
    event SetCourseCompleted(address indexed entity, uint id);
    event CreateCourse(
        address indexed entity,
        string name,
        string desc,
        uint price
    );
    event UpdateCourse(
        address indexed entity,
        uint id,
        string name,
        string desc,
        uint price
    );
    event UpdateCourseState(address indexed entity, uint id);
    event TakeCourse(address indexed entity, uint idCourse);
    event StopTakingCourse(address indexed entity, uint idTakingCourse);
   // event GetCourse(address indexed entity, uint id);
    event SetCourseReputation(
        address indexed entity,
        uint id,
        uint reputation
    );
   // event GetCoursesCompleted(address indexed entity);
    event CreateAssessment(address indexed entity, uint idCourse, string title, string commentary, uint assessment);
    struct Course {
        uint id; //id del curso
        string name; // nombre del curso
        string desc; // descripción
        uint idSpeaker; // ponente del curso
        bool isActive;
        uint reputation; //reputación actual
        uint price; //precio del curso
        uint assessmentsLength;
        uint assessmentsSum;
        
    }
    struct User {
        uint id; // id del usuario
        address _address; // dirección pública del usuario
        string name; // nombre del usuario
        string email; // email
        uint reputation; // reputación actual
        //uint[] coursesOffered; 
        uint coursesOfferedLength;
        uint coursesCompletedLength;
        uint coursesTakingLength;
        
    }
    struct Assessment {
        uint id; // id de valoración
        uint idUser; // id del usuario que realiza la valoración
        //uint idCourse; // id del curso sobre el que se valora Creo que sobra
        string title; // título descriptivo del comentario
        string commentary; //comentario del usuario sobre el curso
        uint assessment; //valoración numérica
    }


    mapping( uint => mapping (uint => Assessment)) public assessments; // [id Curso] [[id valoracion1], [id valoracion2],...]  valoraciones de los usuarios 


    mapping( uint => mapping(uint => uint)) public coursesOffered; // [id usuario] [id cursos ofrecidos] id de los cursos que ofrece el usuario
       
    mapping( uint => mapping(uint => uint)) public coursesTaking; // [id usuario] [id cursos activos] id de los cursos que esta recibiendo el usuario

    mapping( uint => mapping(uint => uint)) public coursesCompleted; // [id usuario] [id cursos completados] id de los cursos que ha recibido el usuario

    mapping(uint => Course) public courses;
    uint public coursesLength;

    mapping(uint => User) public users;
    uint public usersLength;

    mapping(uint => address) public userToOwner;
    mapping(address => uint) public ownerToUser;

    bytes32 public constant CREATEUSER_ROLE = keccak256("CREATEUSER_ROLE");
    bytes32 public constant DELETEUSER_ROLE = keccak256("DELETEUSER_ROLE");
    bytes32 public constant UPDATEUSER_ROLE = keccak256("UPDATEUSER_ROLE");
    bytes32 public constant SETUSERREPUTATION_ROLE =
        keccak256("SETUSERREPUTATION_ROLE");
    //bytes32 public constant GETUSER_ROLE = keccak256("GETUSER_ROLE");
    bytes32 public constant SETCOURSECOMPLETED_ROLE =
        keccak256("SETCOURSECOMPLETED_ROLE");
    bytes32 public constant CREATECOURSE_ROLE = keccak256("CREATECOURSE_ROLE");
    bytes32 public constant UPDATECOURSESTATE_ROLE =
        keccak256("UPDATECOURSESTATE_ROLE");
    bytes32 public constant UPDATECOURSE_ROLE = keccak256("UPDATECOURSE_ROLE");
    //bytes32 public constant GETCOURSE_ROLE = keccak256("GETCOURSE_ROLE");
    bytes32 public constant SETCOURSEREPUTATION_ROLE =
        keccak256("SETCOURSEREPUTATION_ROLE");
    //bytes32 public constant GETCOURSESCOMPLETED_ROLE =
    //    keccak256("GETCOURSESCOMPLETED_ROLE");
    bytes32 public constant CREATEASSESSMENT_ROLE = keccak256("CREATEASSESSMENT_ROLE");



    function initialize() public onlyInit {
        users[0] = User(0, msg.sender, "", "", 0, 0,0,0); //usuario en la pos 0, no existe en realidad
        users[1] = User(1, 0xd873F6DC68e3057e4B7da74c6b304d0eF0B484C7, "Noelia", "ncalde01@ucm.es", 9, 0, 0, 0);
        coursesOffered[1][0] = 0;
        coursesOffered[1][1] = 1;
        users[1].coursesOfferedLength = 2;
        usersLength = 2;
        courses[0] = Course(0, "Learn ReactJS", "Improve your ReactJS skills with our course. Estimated 10 hours.", 0, true, 0, 75,0 , 0);
        courses[1] = Course(1, "Solidity", "Learn to create Smart Contracts with Solidity. Estimated 5 hours.", 0, true, 0, 30, 0 , 0);
        coursesLength = 2;
        
        coursesTaking[1][0] = 0;
        users[1].coursesTakingLength = 1;

        initialized();
    }

    /**
     * @notice create a new user
     * @param name user name
     * @param email  user email
     */
    function createUser(string name, string email)
        external
        auth(CREATEUSER_ROLE)
    {
        require(ownerToUser[msg.sender] == 0);
       
        users[usersLength] = User(
            usersLength,
            msg.sender,
            name,
            email,
            0,
            0,
            0,
            0
        );
        usersLength++;
        userToOwner[usersLength - 1] = msg.sender;
        ownerToUser[msg.sender] = usersLength - 1;
        emit CreateUser(msg.sender, name, email);
    }
    
    /**
     * @notice update name and email of an existing user
     * @param name user name
     * @param email  user email
     */
    function updateUser(uint id, string name, string email)
        external
        auth(UPDATEUSER_ROLE)
    {
        //require(ownerToUser[msg.sender] != 0);
        require(msg.sender == users[id]._address);


        users[id].name = name;
        users[id].email = email;
        emit UpdateUser(msg.sender,id, name, email);
    }

    /**
     * @notice delete an existing user
     * @param id user id to delete
     */
    function deleteUser(uint id) external auth(DELETEUSER_ROLE) {
        require(msg.sender == users[id]._address);
        for (uint j = id; j < usersLength - 1; j++) {
            users[j] = users[j + 1];
        }
        delete users[usersLength - 1];
        usersLength--;
        emit DeleteUser(msg.sender, id);
    }

    /**
     * @notice return a specific user by _address
     * @param _address user address
     
    function getUser(address _address)
        external
        auth(GETEUSER_ROLE)
        returns (User memory)
    {
        return users[ownerToUser[_address]];
    }*/

    /**
     * @notice update user reputation
     * @param id user id to change
     * @param reputation  new reputation
     */
    function setUserReputation(uint id, uint reputation)
        external
        auth(SETUSERREPUTATION_ROLE)
    {
        require(id != ownerToUser[msg.sender]);
        users[id].reputation = reputation;
        emit SetUserReputation(msg.sender, id, reputation);
    }

    /**
     * @notice add a new  completed course to user
     * @param idCourse course id
     */
    function setCourseCompleted(uint idCourse)
        external
        auth(SETCOURSECOMPLETED_ROLE)
    {
        coursesCompleted[ownerToUser[msg.sender]][users[ownerToUser[msg.sender]].coursesCompletedLength]=idCourse;
        users[ownerToUser[msg.sender]].coursesCompletedLength++;
        emit SetCourseCompleted(msg.sender, idCourse);
    }

    /**
     * @notice add a new course
     * @param name course name
     * @param desc  course description
     * @param price  course price
     */
    function createCourse(
        string name,
        string desc,
        uint price
    ) external auth(CREATECOURSE_ROLE) {
        courses[coursesLength] = Course(
            coursesLength,
            name,
            desc,
            ownerToUser[msg.sender],
            true,
            0,
            price,
            0,
            0
        );
        coursesOffered[ownerToUser[msg.sender]][users[ownerToUser[msg.sender]].coursesOfferedLength] = coursesLength;
        users[ownerToUser[msg.sender]].coursesOfferedLength++;
        coursesLength++;
        emit CreateCourse(msg.sender, name, desc, price);
    }

    /**
     * @notice update an existing course
     * @param id course id to modify
     * @param name new name
     * @param desc  new description
     * @param price  new price
     */
    function updateCourse(
        uint id,
        string name,
        string desc,
        uint price
    ) external auth(UPDATECOURSE_ROLE) {
        require(courses[id].idSpeaker == ownerToUser[msg.sender]);
        courses[id].name = name;
        courses[id].desc = desc;
        courses[id].price = price;
        emit UpdateCourse(msg.sender, id, name, desc, price);
    }

    /**
     * @notice enable/disable a course
     * @param id course id to modify
     */
    function updateCourseState(uint id)
        external
        auth(UPDATECOURSESTATE_ROLE)
    {
        require(courses[id].idSpeaker == ownerToUser[msg.sender]);
        courses[id].isActive = courses[id].isActive ? false : true;
        emit UpdateCourseState(msg.sender, id);
    }

    /**
     * @notice take a course 
     * @param id course id to take
     */
    function takeCourse(uint id)
        external
    {
        require(courses[id].isActive);
        require(ownerToUser[msg.sender] != 0);
        coursesTaking[ownerToUser[msg.sender]][users[ownerToUser[msg.sender]].coursesTakingLength] = id;
        users[ownerToUser[msg.sender]].coursesTakingLength++;

        emit TakeCourse(msg.sender, id);
    }
    
    /**
     * @notice stop taking a course
     * @param takingCourseId id of the course you want to stop taking
     */
    function stopTakingCourse(uint takingCourseId)  {
        require(ownerToUser[msg.sender] != 0);
        require(users[ownerToUser[msg.sender]].coursesTakingLength > takingCourseId);

        for (uint j = takingCourseId; j < users[ownerToUser[msg.sender]].coursesTakingLength - 1; j++) {
            coursesTaking[ownerToUser[msg.sender]][j] = coursesTaking[ownerToUser[msg.sender]][j + 1];
        }
        delete coursesTaking[ownerToUser[msg.sender]][users[ownerToUser[msg.sender]].coursesTakingLength - 1];
        users[ownerToUser[msg.sender]].coursesTakingLength--;

        emit StopTakingCourse(msg.sender, takingCourseId);
    }

    /**
     * @notice return a specific course by id
     * @param id course id 
     
    function getCourse(uint id)
        external
        auth(GETCOURSE_ROLE)
        returns (Course memory)
    {
        return courses[id];
    }*/

    /**
     * @notice create an assessment for a course
     * @param idCourse course id to assesst
     * @param title Title of the assessment 
     * @param commentary Commentary of the assessment 
     * @param assessment Numerical value (1-5) of the assessment 
     */
    function createAssessment(
        uint idCourse, 
        string title,
        string commentary,
        uint assessment
    ) external auth(CREATEASSESSMENT_ROLE) {
        assessments[idCourse][courses[idCourse].assessmentsLength] = Assessment(
            courses[idCourse].assessmentsLength,
            ownerToUser[msg.sender], 
            title,
            commentary,
            assessment
        );
        courses[idCourse].assessmentsSum += assessment;
        courses[idCourse].assessmentsLength++;
        courses[idCourse].reputation = courses[idCourse].assessmentsSum / courses[idCourse].assessmentsLength;
        emit CreateAssessment(msg.sender, idCourse, title, commentary, assessment);
    }
}
