import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Button from 'react-bootstrap/Button';

import Modal from 'react-bootstrap/Modal';
import ModalBody from "react-bootstrap/ModalBody";
import ModalFooter from "react-bootstrap/ModalFooter";

import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import NavbarBrand from 'react-bootstrap/NavbarBrand';
import Nav from 'react-bootstrap/Nav';
import {Link} from 'react-router-dom';

import Table from 'react-bootstrap/Table';

import Swal from 'sweetalert2'

import Form from 'react-bootstrap/Form'
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import CloseButton from 'react-bootstrap/CloseButton';


import NavDropdown from 'react-bootstrap/NavDropdown';
import Offcanvas from 'react-bootstrap/Offcanvas';
import { FaChartBar, FaUsers, FaBuilding, FaMapMarkerAlt, FaMoneyBillAlt, FaDoorOpen, FaTrash, FaEdit, FaHome } from 'react-icons/fa'; 
import logo from './workunity.png';

const Addresses = () => {
    const [addresses, setAddresses] = useState([]);
    let address;
    let token;
    try {
        address = JSON.parse(localStorage.getItem('token'));
        token = address.data.token;
    } catch (error) {
        // Handle JSON parsing error or token not found
        console.error("Error parsing token:", error);
        // Set token to a default value or handle the error as needed
        token = "";
    }

    /* Contains the token to be passed during endpoint request */
    const headers = {
        accept: 'application/json',
        Authorization: token
    }


    /* Autoloads the data */
    useEffect(()=>{
        fetchAddresses()
    }, [])

    /* 1. Display Addresses */
    const fetchAddresses = async () => {
        try {
            const response = await axios.get('http://localhost:3001/Addresses', { headers: headers});
            const addressDataArray = Object.values(response.data)[0];
            const addressesData = Array.isArray(addressDataArray) ? addressDataArray : [];
            console.log(addressesData);
            if (addressesData.length === 0) {
                // Handle the case when no departments are found
                // For example, display a message to the user
                console.log("No positions found.");
            } else {
                setAddresses(addressesData);
            }
        } catch (error) {
            console.error('Error fetching addresses:', error);
        }
    }
    
    
    
    
    /* 2. Create Position */
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const [showupdate, setShowupdate] = useState(false);
    const handleShowupdate = () => setShowupdate(true);
    const handleCloseupdate = () => setShowupdate(false);

    const [AddressID, setAddressID] = useState("")
    const [EmployeeID, setEmployeeID] = useState("")
    const [AddressLine1, setAddressLine1] = useState("")
    const [City, setCity] = useState("")

    const [validationError, setValidationError] = useState({})

    const [id,setid] = useState({})


    const createProduct = async (e) => {

        e.preventDefault();

        console.log(AddressID);
        console.log(EmployeeID);
        console.log(AddressLine1);
        console.log(City);

        const formData = new FormData()
        formData.append('AddressID', AddressID)
        formData.append('EmployeeID', EmployeeID) 
        formData.append('AddressLine1', AddressLine1)
        formData.append('City', City) 

            await axios.post('http://localhost:3001/Addresses/register', {AddressID, EmployeeID, AddressLine1, City}).then(({data})=>{
                Swal.fire({
                    icon:"success",
                    text:data.message
                })

                fetchAddresses();
            }).catch(({response})=>{
                if(response.status===442){
                    setValidationError(response.data.errors)
                }else{
                    Swal.fire({
                        text:response.data.message,
                        icon:"error"
                    })
                }
            })  
        
    
    }

    const deleteProduct = async (id) => {
        const isConfirm = await Swal.fire({
            title: "Are you sure?",
            text:  "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then((result)=>{
            return result.isConfirmed
        });

        if(!isConfirm){
            return;
        }

        await axios.delete(`http://localhost:3001/Addresses/${id}`, {headers: headers}).then(({data})=>{
            Swal.fire({
                icon:"success",
                text:"Succesfully Deleted"
            })

            fetchAddresses()
        }).catch(({response:{status, data}})=>{
            if(status === 404){
                Swal.fire({
                    text:"Position not found",
                    icon:"error"
                })
            } else {
                Swal.fire({
                    text:data.message,
                    icon:"error"
                })
            }
        })
    }

    return (
        <>
      <div className="sidebar">
      <img src={logo} alt="Logo" className="logo" />
        <Nav className="flex-column">
        <Nav.Link as={Link} to="/home">
            <FaHome /> Home
          </Nav.Link>
          <Nav.Link as={Link} to="/dashboard">
            <FaChartBar /> Employees
          </Nav.Link>
          <Nav.Link as={Link} to="/department">
            <FaBuilding /> Departments
          </Nav.Link>
          <Nav.Link as={Link} to="/positions">
            <FaUsers /> Positions
          </Nav.Link>
          <Nav.Link as={Link} to="/addresses">
            <FaMapMarkerAlt /> Addresses
          </Nav.Link>
          <Nav.Link as={Link} to="/salaries">
            <FaMoneyBillAlt /> Salaries
          </Nav.Link>

        </Nav>
        
      </div>




      <Modal show={showupdate} onHide={handleCloseupdate}>
                <Modal.Header closeButton>
                    <Modal.Title>Update Address</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                <Form onSubmit={      
    async (e) => {
        try {
            const updatePosition = await axios.put(`http://localhost:3001/Addresses/${id.AddressID}`, {
                AddressID: AddressID,
                EmployeeID: EmployeeID,
                AddressLine1: AddressLine1,
                City: City,
            }, { headers: headers });
            console.log(updatePosition);
            handleShow(); // Show the modal form

            // Reset form fields
            setAddressID("");
            setEmployeeID("");
            setAddressLine1("");
            setCity("");
        } catch (error) {
            console.log(error);
        }
    }
}>
                        <Row>
                            <Col>
                                <Form.Group controlId="AddressID">
                                    <Form.Label>AddressID</Form.Label>
                                    <Form.Control type="text" defaultValue={id.AddressID} onChange={(event) => { setAddressID(event.target.value) }} />
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <Form.Group controlId="EmployeeID">
                                    <Form.Label>EmployeeID</Form.Label>
                                    <Form.Control type="text" defaultValue={id.EmployeeID} onChange={(event) => { setEmployeeID(event.target.value) }} />
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <Form.Group controlId="AddressLine1">
                                    <Form.Label>AddressLine1</Form.Label>
                                    <Form.Control type="text" defaultValue={id.AddressLine1} onChange={(event) => { setAddressLine1(event.target.value) }} />
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <Form.Group controlId="City">
                                    <Form.Label>City</Form.Label>
                                    <Form.Control type="text" defaultValue={id.City} onChange={(event) => { setCity(event.target.value) }} />
                                </Form.Group>
                            </Col>
                        </Row>
                        <Button variant='dark' className='mt-2' size='sm' block='block' type='submit'>Save</Button>
                    </Form>
                </Modal.Body>
            </Modal>



        
        <div className="container" style={{ maxWidth: '80%' , marginTop: '25px', marginRight: '50px'}}>
                
            <div className="total-users-box" style={{ marginBottom: '20px', padding: '10px', border: '1px solid black', borderRadius: '5px' }}>
                Total Addresses: {addresses.length}
                </div>


                <div className='col-12'>
                    <Button variant="btn btn-dark mb-2 float-end btn-sm me-2" onClick={handleShow} >Add Address</Button>
                </div>
                
                <Table striped bordered hover style={{fontSize: 'small'}}>
                    <thead>
                        <tr>
                        <th>Address ID</th>
                        <th>Employee ID</th>
                        <th>AddressLine1</th>
                        <th>City</th>
                        </tr>
                    </thead>

                    <tbody>
                    {
                        addresses.length > 0 && (
                            addresses.slice(0, 10).map((row, key)=>(
                                <tr key={key}>
                                    <td>{row.AddressID}</td>
                                    <td>{row.EmployeeID}</td>
                                    <td>{row.AddressLine1}</td>
                                    <td>{row.City}</td>
                                    <td>
                                        <Button className='btn btn-dark btn-sm' onClick={()=>deleteProduct(row.AddressID)} >  <FaTrash/>
                                            
                                        </Button>
                                        <Button className='btn btn-secondary btn-sm' onClick={() => {
                                            handleShowupdate() 
                                            setid(row)
                                        }
                                            
                                  
                                        
                                        } style={{ marginLeft: '20px' }}>
                                            <FaEdit />
                                        </Button>
                                    </td>
                                </tr>
                            ))
                        )
                    }
                    </tbody>

                </Table>    

            </div>   
           
            <Modal show={show} onHide={handleClose}>

        <Modal.Header closeButton>
                <Modal.Title>Add Address</Modal.Title>
        </Modal.Header>
                <Modal.Body>
                
                <Form onSubmit={createProduct}>
                    <Row>
                        <Col>
                            <Form.Group controlId="AddresID">
                                <Form.Label>AddresID</Form.Label>
                                <Form.Control type="text" value={AddressID} onChange={(event)=>{setAddressID(event.target.value)}}/>
                            </Form.Group>
                        </Col>
                    </Row>

                    <Row>
                        <Col>
                            <Form.Group controlId="EmployeeID">
                                <Form.Label>EmployeeID</Form.Label>
                                <Form.Control type="text" value={EmployeeID} onChange={(event)=>{setEmployeeID(event.target.value)}}/>
                            </Form.Group>
                        </Col>
                    </Row>

                    <Row>
                        <Col>
                            <Form.Group controlId="AddresLine1">
                                <Form.Label>AddresLine1</Form.Label>
                                <Form.Control type="text" value={AddressLine1} onChange={(event)=>{setAddressLine1(event.target.value)}}/>
                            </Form.Group>
                        </Col>
                    </Row>

                    <Row>
                        <Col>
                            <Form.Group controlId="City">
                                <Form.Label>City</Form.Label>
                                <Form.Control type="text" value={City} onChange={(event)=>{setCity(event.target.value)}}/>
                            </Form.Group>
                        </Col>
                    </Row>

                    <Button variant='dark' className='mt-2' size='sm' block='block' type='submit'>Save</Button>

                </Form>
                </Modal.Body> 
            </Modal>
        
        </>
    );
}
export default Addresses;