pragma solidity ^0.4.24;

import "@aragon/os/contracts/apps/AragonApp.sol";
import "@aragon/os/contracts/lib/math/SafeMath.sol";

contract Courses is AragonApp {
    //EVENTS
    event CreateUser(address indexed entity, string name, string email);
    event DeleteUser(address indexed entity, uint256 id);
    event UpdateUser(address indexed entity, string name, string email);
    event SetUserReputation(
        address indexed entity,
        uint256 id,
        uint256 reputation
    );
   // event GetUser(address indexed entity);
    event SetCourseCompleted(address indexed entity, uint256 id);
    event CreateCourse(
        address indexed entity,
        string name,
        string desc,
        uint256 price
    );
    event UpdateCourse(
        address indexed entity,
        uint256 id,
        string name,
        string desc,
        uint256 price
    );
    event UpdateCourseState(address indexed entity, uint256 id);
   // event GetCourse(address indexed entity, uint256 id);
    event SetCourseReputation(
        address indexed entity,
        uint256 id,
        uint256 reputation
    );
   // event GetCoursesCompleted(address indexed entity);

    struct Course {
        uint256 id; //id del curso
        string name; // nombre del curso
        string desc; // descripción
        uint256 idSpeaker; // ponente del curso
        bool isActive;
        //mapping (uint => Valoracion) valoraciones; // valoraciones de los usuarios
        uint256 reputation; //reputación actual
        uint256 price; //precio del curso
    }
    struct User {
        uint256 id; // id del usuario
        address _address; // dirección pública del usuario
        string name; // nombre del usuario
        string email; // email
        uint256 reputation; // reputación actual
        uint256[] coursesOffered; // id de los cursos que ofrece el usuario
        uint256[] coursesCompleted; // id de los cursos que ha recibido el usuario
    }
    struct Valoracion {
        uint256 id; // id de valoración
        uint256 idUser; // id del usuario que realiza la valoración
        uint256 idCourse; // id del curso sobre el que se valora Creo que sobra
        string title; // título descriptivo del comentario
        string commentary; //comentario del usuario sobre el curso
        uint256 valoracion; //valoración numérica
    }

    mapping(uint256 => Course) public courses;
    uint256 public coursesLength;

    mapping(uint256 => User) public users;
    uint256 public usersLength;

    mapping(uint256 => address) public userToOwner;
    mapping(address => uint256) public ownerToUser;

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
        uint256[] memory a;
        uint256[] memory b;
        users[usersLength] = User(0, msg.sender, "", "", 0, a, b); //usuario en la pos 0, no existe en realidad
        usersLength = 1;
        coursesLength = 0;


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
        uint256[] memory a;
        uint256[] memory b;
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

        uint256 id = ownerToUser[msg.sender];

        users[id].name = name;
        users[id].email = email;
        emit UpdateUser(msg.sender, name, email);
    }

    /**
     * @notice delete an existing user
     * @param id user id to delete
     */
    function deleteUser(uint256 id) external auth(DELETEUSER_ROLE) {
        require(msg.sender == users[id]._address);
        for (uint256 j = id; j < usersLength - 1; j++) {
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
    function setUserReputation(uint256 id, uint256 reputation)
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
    function setCourseCompleted(uint256 idCourse)
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
        uint256 price
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
        uint256 id,
        string name,
        string desc,
        uint256 price
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
    function updateCourseState(uint256 id)
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
     
    function getCourse(uint256 id)
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
    function setCourseReputation(uint256 id, uint256 reputation)
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
        returns (uint256[] memory)
    {
        return users[ownerToUser[msg.sender]].coursesCompleted;
    }*/
}
