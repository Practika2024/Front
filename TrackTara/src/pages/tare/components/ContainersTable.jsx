import { useEffect, useState } from 'react';
import { Table, Button, Row, Col, Modal, Form, Pagination } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { fetchContainers } from '../../../store/state/actions/containerActions';
import { fetchContainerTypes, fetchContainerTypeNameById } from '../../../store/state/actions/containerTypeActions';
import ContainerFilterForm from './ContainerFilterForm.jsx';
import { deleteContainer } from '../../../utils/services/ContainerService.js';

const ContainersTable = () => {
    const dispatch = useDispatch();
    const containers = useSelector(state => state.containers?.containers || []);
    const containerTypes = useSelector(state => state.containerTypes?.containerTypes || []);

    const [selectedContainerId, setSelectedContainerId] = useState(null);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [confirmText, setConfirmText] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [filteredContainers, setFilteredContainers] = useState([]);
    const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'ascending' });
    const [typeNames, setTypeNames] = useState({});

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
                setFilteredContainers(prev => prev.filter(container => container.id !== selectedContainerId));
                setShowConfirmModal(false);
                setConfirmText('');
            } catch (error) {
                console.error('Error deleting container:', error);
            }
        }
    };

    const handleFilter = (filters) => {
        const { name, minVolume, maxVolume, type, isEmpty } = filters;
        setFilteredContainers(containers.filter(container =>
            (!name || container.name.includes(name)) &&
            container.volume >= minVolume && container.volume <= maxVolume &&
            (type.length === 0 || type.includes(container.type)) &&
            (isEmpty === null || container.isEmpty === isEmpty)
        ));
    };

    const handleSort = (key) => {
        setSortConfig(prev => ({
            key,
            direction: prev.key === key && prev.direction === 'ascending' ? 'descending' : 'ascending'
        }));
    };

    const sortedContainers = [...filteredContainers].sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'ascending' ? -1 : 1;
        if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'ascending' ? 1 : -1;
        return 0;
    });

    const indexOfFirstItem = (currentPage - 1) * itemsPerPage;
    const indexOfLastItem = currentPage * itemsPerPage;
    const currentItems = sortedContainers.slice(indexOfFirstItem, indexOfLastItem);

    return (
        <div className="container mt-5">
            <h2 className="mb-4">Список контейнерів</h2>
            <Row>
                <Col lg={3}>
                    <ContainerFilterForm onFilter={handleFilter} />
                </Col>
                <Col lg={9}>
                    {filteredContainers.length === 0 ? (
                        <div className="alert alert-warning">Контейнери відсутні</div>
                    ) : (
                        <Table striped bordered hover>
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
                                    <td>{container.containerId ? 'тут буде назва продукту' : 'Так'}</td>
                                    <td>
                                        <Button variant="danger" onClick={() => handleDelete(container.id)}>
                                            Видалити
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </Table>
                    )}
                    <Pagination>
                        {Array.from({ length: Math.ceil(filteredContainers.length / itemsPerPage) }, (_, index) => (
                            <Pagination.Item
                                key={index + 1}
                                active={index + 1 === currentPage}
                                onClick={() => setCurrentPage(index + 1)}
                            >
                                {index + 1}
                            </Pagination.Item>
                        ))}
                    </Pagination>
                </Col>
            </Row>
            <Modal show={showConfirmModal} onHide={() => setShowConfirmModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Підтвердження видалення</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Group>
                        <Form.Label>Введіть &quot;Видалити&quot; для підтвердження</Form.Label>
                        <Form.Control
                            type="text"
                            value={confirmText}
                            onChange={(e) => setConfirmText(e.target.value)}
                        />
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowConfirmModal(false)}>Скасувати</Button>
                    <Button variant="danger" onClick={confirmDelete}>Видалити</Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default ContainersTable;
