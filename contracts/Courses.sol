pragma solidity ^0.4.24;

import "@aragon/os/contracts/apps/AragonApp.sol";
import "@aragon/os/contracts/lib/math/SafeMath.sol";

contract Courses is AragonApp {
    //EVENTS
    event CreateUser(address indexed entity, string name, string email);
    event DeleteUser(address indexed entity, uint id);
    event UpdateUser(address indexed entity, string name, string email);
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
   // event GetCourse(address indexed entity, uint id);
    event SetCourseReputation(
        address indexed entity,
        uint id,
        uint reputation
    );
   // event GetCoursesCompleted(address indexed entity);

    struct Course {
        uint id; //id del curso
        string name; // nombre del curso
        string desc; // descripción
        uint idSpeaker; // ponente del curso
        bool isActive;
        //mapping (uint => Valoracion) valoraciones; // valoraciones de los usuarios
        uint reputation; //reputación actual
        uint price; //precio del curso
    }
    struct User {
        uint id; // id del usuario
        address _address; // dirección pública del usuario
        string name; // nombre del usuario
        string email; // email
        uint reputation; // reputación actual
        uint[] coursesOffered; // id de los cursos que ofrece el usuario
        uint[] coursesCompleted; // id de los cursos que ha recibido el usuario
    }
    struct Valoracion {
        uint id; // id de valoración
        uint idUser; // id del usuario que realiza la valoración
        uint idCourse; // id del curso sobre el que se valora Creo que sobra
        string title; // título descriptivo del comentario
        string commentary; //comentario del usuario sobre el curso
        uint valoracion; //valoración numérica
    }

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

    function initialize() public onlyInit {
        uint[] memory a  = new uint [] (500);
        uint[] memory b = new uint [] (500);
        uint[]  memory c = new uint [](500);
        c[0] = 0;
        users[0] = User(0, msg.sender, "", "", 0, a, b); //usuario en la pos 0, no existe en realidad
        users[1] = User(1, 0xd873F6DC68e3057e4B7da74c6b304d0eF0B484C7, "Noelia", "ncalde01@ucm.es", 9, c, b);
        usersLength = 2;
        courses[0] = Course(0, "Learn ReactJS", "Improve your ReactJS skills with our course. Estimated 10 hours.", 1, true, 8, 75 );
        courses[1] = Course(1, "Learn ReactJS", "Improve your ReactJS skills with our course. Estimated 10 hours.", 1, true, 8, 75 );
        coursesLength = 2;


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
        uint[] memory a;
        uint[] memory b;
        users[usersLength] = User(
            usersLength,
            msg.sender,
            name,
            email,
            0,
            a,
            b
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
    function updateUser(string name, string email)
        external
        auth(UPDATEUSER_ROLE)
    {
        require(ownerToUser[msg.sender] != 0);
        require(msg.sender == users[ownerToUser[msg.sender]]._address);

        uint id = ownerToUser[msg.sender];

        users[id].name = name;
        users[id].email = email;
        emit UpdateUser(msg.sender, name, email);
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
        users[ownerToUser[msg.sender]].coursesCompleted.push(idCourse);
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
            price
        );
        users[ownerToUser[msg.sender]].coursesOffered.push(coursesLength);
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
     * @notice update course reputation
     * @param id course id to change
     * @param reputation  new reputation
     */
    function setCourseReputation(uint id, uint reputation)
        external
        auth(SETCOURSEREPUTATION_ROLE)
    {
        courses[id].reputation = reputation;
        emit SetCourseReputation(msg.sender, id, reputation);
    }

     /**
     * @notice return completed courses
     
    function getCoursesCompleted()
        external
        auth(GETCOURSESCOMPLETED_ROLE)
        returns (uint[] memory)
    {
        return users[ownerToUser[msg.sender]].coursesCompleted;
    }*/
}
