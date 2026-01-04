import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Table, Badge, Alert } from 'react-bootstrap';
import { SectorService } from '../../utils/services';
import { toast } from 'react-toastify';

const SectorsManagement = ({ show, onHide }) => {
  const [sectors, setSectors] = useState([]);
  const [newSectorName, setNewSectorName] = useState('');
  const [selectedSector, setSelectedSector] = useState(null);
  const [newRowNumber, setNewRowNumber] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (show) {
      loadSectors();
    }
  }, [show]);

  const loadSectors = async () => {
    try {
      setLoading(true);
      const data = await SectorService.getAllSectors();
      setSectors(data);
    } catch (error) {
      toast.error('Помилка завантаження секторів');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSector = async (e) => {
    e.preventDefault();
    if (!newSectorName.trim()) {
      toast.error('Введіть назву сектора');
      return;
    }

    try {
      await SectorService.createSector(newSectorName);
      toast.success(`Сектор "${newSectorName.toUpperCase()}" створено`);
      setNewSectorName('');
      await loadSectors();
    } catch (error) {
      const message = error.response?.data || 'Помилка створення сектора';
      toast.error(message);
    }
  };

  const handleDeleteSector = async (sectorName) => {
    if (!window.confirm(`Ви впевнені, що хочете видалити сектор "${sectorName}"?`)) {
      return;
    }

    try {
      await SectorService.deleteSector(sectorName);
      toast.success(`Сектор "${sectorName}" видалено`);
      await loadSectors();
      if (selectedSector === sectorName) {
        setSelectedSector(null);
      }
    } catch (error) {
      const message = error.response?.data || 'Помилка видалення сектора';
      toast.error(message);
    }
  };

  const handleAddRow = async (e) => {
    e.preventDefault();
    if (!selectedSector) {
      toast.error('Оберіть сектор');
      return;
    }

    if (!newRowNumber || isNaN(newRowNumber) || parseInt(newRowNumber) < 1 || parseInt(newRowNumber) > 99) {
      toast.error('Введіть коректний номер ряду (1-99)');
      return;
    }

    try {
      await SectorService.addRowToSector(selectedSector, newRowNumber);
      toast.success(`Ряд ${newRowNumber} додано до сектора "${selectedSector}"`);
      setNewRowNumber('');
      await loadSectors();
    } catch (error) {
      const message = error.response?.data || 'Помилка додавання ряду';
      toast.error(message);
    }
  };

  const handleRemoveRow = async (sectorName, rowNumber) => {
    if (!window.confirm(`Видалити ряд ${rowNumber} з сектора "${sectorName}"?`)) {
      return;
    }

    try {
      await SectorService.removeRowFromSector(sectorName, rowNumber);
      toast.success(`Ряд ${rowNumber} видалено з сектора "${sectorName}"`);
      await loadSectors();
    } catch (error) {
      const message = error.response?.data || 'Помилка видалення ряду';
      toast.error(message);
    }
  };

  return (
    <Modal show={show} onHide={onHide} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Управління секторами та рядами</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {loading ? (
          <div className="text-center">Завантаження...</div>
        ) : (
          <>
            {/* Створення нового сектора */}
            <div className="mb-4 p-3 border rounded">
              <h5>Створити новий сектор</h5>
              <Form onSubmit={handleCreateSector} className="d-flex gap-2">
                <Form.Control
                  type="text"
                  placeholder="Назва сектора (A, B, C...)"
                  value={newSectorName}
                  onChange={(e) => {
                    const value = e.target.value.toUpperCase().replace(/[^A-Z]/g, '').slice(0, 1);
                    setNewSectorName(value);
                  }}
                  maxLength={1}
                  required
                />
                <Button type="submit" variant="primary">
                  Створити
                </Button>
              </Form>
            </div>

            {/* Список секторів */}
            <div className="mb-4">
              <h5>Сектори та ряди</h5>
              {sectors.length === 0 ? (
                <Alert variant="info">Секторів поки що немає. Створіть перший сектор.</Alert>
              ) : (
                <Table striped bordered hover>
                  <thead>
                    <tr>
                      <th>Сектор</th>
                      <th>Ряди</th>
                      <th>Дії</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sectors.map((sector) => (
                      <tr key={sector.sector}>
                        <td>
                          <strong>{sector.sector}</strong>
                        </td>
                        <td>
                          <div className="d-flex flex-wrap gap-1">
                            {sector.rows.length === 0 ? (
                              <span className="text-muted">Немає рядів</span>
                            ) : (
                              sector.rows.map((row) => (
                                <Badge
                                  key={row}
                                  bg="secondary"
                                  className="d-inline-flex align-items-center gap-1"
                                >
                                  {row}
                                  <button
                                    type="button"
                                    className="btn-close btn-close-white"
                                    style={{ fontSize: '0.6rem' }}
                                    onClick={() => handleRemoveRow(sector.sector, row)}
                                    aria-label="Видалити ряд"
                                  />
                                </Badge>
                              ))
                            )}
                          </div>
                        </td>
                        <td>
                          <div className="d-flex gap-2">
                            <Button
                              variant="outline-primary"
                              size="sm"
                              onClick={() => setSelectedSector(sector.sector)}
                            >
                              Додати ряд
                            </Button>
                            <Button
                              variant="outline-danger"
                              size="sm"
                              onClick={() => handleDeleteSector(sector.sector)}
                            >
                              Видалити сектор
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}
            </div>

            {/* Додавання ряду до вибраного сектора */}
            {selectedSector && (
              <div className="p-3 border rounded bg-light">
                <h6>Додати ряд до сектора "{selectedSector}"</h6>
                <Form onSubmit={handleAddRow} className="d-flex gap-2">
                  <Form.Control
                    type="number"
                    placeholder="Номер ряду (1-99)"
                    value={newRowNumber}
                    onChange={(e) => setNewRowNumber(e.target.value)}
                    min="1"
                    max="99"
                    required
                  />
                  <Button type="submit" variant="success">
                    Додати
                  </Button>
                  <Button
                    variant="outline-secondary"
                    onClick={() => {
                      setSelectedSector(null);
                      setNewRowNumber('');
                    }}
                  >
                    Скасувати
                  </Button>
                </Form>
              </div>
            )}
          </>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Закрити
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default SectorsManagement;

