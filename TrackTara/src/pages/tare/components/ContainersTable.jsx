import { useEffect, useState } from 'react';
import { Table, Button, Row, Col, Offcanvas, Form, Pagination } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { fetchContainers } from '../../../store/state/actions/containerActions';
import { fetchContainerTypes, fetchContainerTypeNameById } from '../../../store/state/actions/containerTypeActions';
import ContainerFilterForm from './ContainerFilterForm.jsx';
import { deleteContainer } from '../../../utils/services/ContainerService.js';
import { Link, useNavigate } from 'react-router-dom';

const ContainersTable = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const containers = useSelector(state => state.containers?.containers || []);
    const containerTypes = useSelector(state => state.containerTypes?.types || []);

    const [selectedContainerId, setSelectedContainerId] = useState(null);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [confirmText, setConfirmText] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [filteredContainers, setFilteredContainers] = useState([]);
    const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'ascending' });
    const [typeNames, setTypeNames] = useState({});
    const [showFilterOffcanvas, setShowFilterOffcanvas] = useState(false); // Offcanvas state

    const itemsPerPage = 10;

    useEffect(() => {
        dispatch(fetchContainers());
        dispatch(fetchContainerTypes());
    }, [dispatch]);

    useEffect(() => {
        setFilteredContainers(containers);
    }, [containers]);

    useEffect(() => {
        const fetchTypeNames = async () => {
            const names = { ...typeNames };
            for (const container of containers) {
                if (!names[container.typeId]) {
                    const name = await dispatch(fetchContainerTypeNameById(container.typeId));
                    names[container.typeId] = name;
                }
            }
            setTypeNames(names);
        };
        fetchTypeNames();
    }, [containers, dispatch]);

    const handleDelete = (id) => {
        setSelectedContainerId(id);
        setShowConfirmModal(true);
    };

    const confirmDelete = async () => {
        if (confirmText === 'Видалити') {
            try {
                await deleteContainer(selectedContainerId);
                setFilteredContainers(prev =>
                    prev.filter(container => container.id !== selectedContainerId)
                );
                setShowConfirmModal(false);
                setConfirmText('');
            } catch (error) {
                console.error('Error deleting container:', error);
            }
        }
    };

    const handleFilter = (filters) => {
        const { uniqueCode, name, minVolume, maxVolume, type, isEmpty } = filters;
        setFilteredContainers(
            containers.filter(container =>
                (!uniqueCode || container.uniqueCode.includes(uniqueCode)) &&
                (!name || container.name.includes(name)) &&
                container.volume >= minVolume &&
                container.volume <= maxVolume &&
                (type.length === 0 || type.includes(String(container.typeId))) &&
                (isEmpty === null || container.isEmpty === isEmpty)
            )
        );
    };

    const handleSort = (key) => {
        setSortConfig(prev => ({
            key,
            direction: prev.key === key && prev.direction === 'ascending' ? 'descending' : 'ascending'
        }));
    };

    const sortedContainers = [...filteredContainers].sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key])
            return sortConfig.direction === 'ascending' ? -1 : 1;
        if (a[sortConfig.key] > b[sortConfig.key])
            return sortConfig.direction === 'ascending' ? 1 : -1;
        return 0;
    });

    const indexOfFirstItem = (currentPage - 1) * itemsPerPage;
    const indexOfLastItem = currentPage * itemsPerPage;
    const currentItems = sortedContainers.slice(indexOfFirstItem, indexOfLastItem);

    return (
        <div className="container mt-5">
            <h2 className="mb-4">Список контейнерів</h2>
            <div className="text-end mb-3">
                <Link  title={`Додати контейнер `} to="/tare/create" className="btn btn-primary">
                    <img
                        src="public/Icons for functions/free-icon-plus-3303893.png"
                        alt="Create New Container"
                        height="20"
                    />
                </Link>
            </div>
            <Row>
                <Col lg={3} className="d-none d-lg-block">
                    <ContainerFilterForm onFilter={handleFilter} />
                </Col>
                <Col lg={9}>
                    <Button className="d-lg-none mb-3" onClick={() => setShowFilterOffcanvas(true)}>
                        Фільтрувати
                    </Button>
                    {filteredContainers.length === 0 ? (
                        <div className="alert alert-warning">Контейнери відсутні</div>
                    ) : (
                        <Table striped bordered hover responsive>
                            <thead>
                            <tr>
                                <th onClick={() => handleSort('uniqueCode')}>Код</th>
                                <th onClick={() => handleSort('name')}>Ім&apos;я</th>
                                <th onClick={() => handleSort('typeId')}>Тип</th>
                                <th onClick={() => handleSort('volume')}>Об&apos;єм(л)</th>
                                <th>Чи порожній</th>
                                <th>Дії</th>
                            </tr>
                            </thead>
                            <tbody>
                            {currentItems.map(container => (
                                <tr key={container.id}>
                                    <td>{container.uniqueCode}</td>
                                    <td>{container.name}</td>
                                    <td>{typeNames[container.typeId] || 'Loading...'}</td>
                                    <td>{container.volume}</td>
                                    <td>
                                        {container.isEmpty ? 'Так' : 'тут буде назва продукту'}
                                    </td>
                                    <td>
                                        <Button
                                            title={`Редагувати контейнер `}
                                            variant="link"
                                            onClick={() => navigate(`/tare/update/${container.id}`)}
                                            className="p-0 border-4"
                                        >

                                            <img
                                                src="/Icons for functions/free-icon-edit-3597088.png"
                                                alt="Edit"
                                                height="20"
                                            />
                                        </Button>
                                        <Button
                                            title={`Видалити контейнер `}
                                            variant="link"
                                            onClick={() => handleDelete(container.id)}
                                            className="p-0 border-4"
                                        >
                                            <img
                                                src="/Icons for functions/free-icon-recycle-bin-3156999.png"
                                                alt="Delete"
                                                height="20"
                                            />
                                        </Button>
                                        <Button
                                            title={`Деталі контейнера`}
                                            variant="link"
                                            onClick={() => navigate(`/tare/detail/${container.id}`)}
                                            className="p-0 border-4"
                                        >
                                            <img
                                                src="/Icons for functions/free-icon-info-1445402.png"
                                                alt="Details"
                                                height="20"
                                            />
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </Table>
                    )}
                    <Pagination>
                        {Array.from(
                            { length: Math.ceil(filteredContainers.length / itemsPerPage) },
                            (_, index) => (
                                <Pagination.Item
                                    key={index + 1}
                                    active={index + 1 === currentPage}
                                    onClick={() => setCurrentPage(index + 1)}
                                >
                                    {index + 1}
                                </Pagination.Item>
                            )
                        )}
                    </Pagination>
                </Col>
            </Row>

            {/* Offcanvas for mobile filters */}
            <Offcanvas
                show={showFilterOffcanvas}
                onHide={() => setShowFilterOffcanvas(false)}
                placement="start"
                className="offcanvas-fullscreen" // Make it full screen
            >
                <Offcanvas.Header>
                    <Button variant="secondary" onClick={() => setShowFilterOffcanvas(false)}>
                        Назад
                    </Button>
                    <Offcanvas.Title className="ms-3">Фільтри</Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body>
                    <ContainerFilterForm onFilter={handleFilter} />
                </Offcanvas.Body>
            </Offcanvas>
        </div>
    );
};

export default ContainersTable;
