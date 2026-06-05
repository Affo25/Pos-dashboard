import React, { useEffect, useState } from "react";

const SupplierModal = ({ selectedSupplier, onCreate, onUpdate, loading = false }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [openingBalance, setOpeningBalance] = useState("");
  const [openingBalanceNote, setOpeningBalanceNote] = useState("");

  useEffect(() => {
    if (selectedSupplier) {
      setName(selectedSupplier.supplierName || "");
      setEmail(selectedSupplier.email || "");
      setPhone(selectedSupplier.phone || "");
      setAddress(selectedSupplier._raw?.address || selectedSupplier.country || "");
      setOpeningBalance(String(selectedSupplier._raw?.opening_balance ?? ""));
      setOpeningBalanceNote(selectedSupplier._raw?.opening_balance_note || "");
    }
  }, [selectedSupplier]);

  const resetAddForm = () => {
    setName("");
    setEmail("");
    setPhone("");
    setAddress("");
    setOpeningBalance("");
    setOpeningBalanceNote("");
  };

  const buildPayload = () => ({
    name: name.trim(),
    email: email.trim(),
    phone: phone.trim(),
    address: address.trim(),
    opening_balance: Number(openingBalance || 0),
    opening_balance_note: openingBalanceNote.trim(),
  });

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) return;
    await onCreate(buildPayload());
    resetAddForm();
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!selectedSupplier?.id || !name.trim() || !phone.trim()) return;
    await onUpdate(selectedSupplier.id, buildPayload());
  };

  return (
    <div>
      <div className="modal fade" id="add-units">
        <div className="modal-dialog modal-dialog-centered custom-modal-two">
          <div className="modal-content">
            <div className="page-wrapper-new p-0">
              <div className="content">
                <div className="modal-header border-0 custom-modal-header">
                  <div className="page-title">
                    <h4>Add Supplier</h4>
                  </div>
                  <button
                    type="button"
                    className="close"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                  >
                    <span aria-hidden="true">×</span>
                  </button>
                </div>
                <div className="modal-body custom-modal-body">
                  <form onSubmit={handleCreate}>
                    <div className="row">
                      <div className="col-lg-4">
                        <div className="input-blocks">
                          <label>Supplier Name</label>
                          <input
                            type="text"
                            className="form-control"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                          />
                        </div>
                      </div>
                      <div className="col-lg-4">
                        <div className="input-blocks">
                          <label>Email</label>
                          <input
                            type="email"
                            className="form-control"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                          />
                        </div>
                      </div>
                      <div className="col-lg-4">
                        <div className="input-blocks">
                          <label>Phone</label>
                          <input
                            type="text"
                            className="form-control"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                          />
                        </div>
                      </div>
                      <div className="col-lg-12">
                        <div className="input-blocks">
                          <label>Address</label>
                          <input
                            type="text"
                            className="form-control"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="modal-footer-btn">
                      <button
                        type="button"
                        className="btn btn-cancel me-2"
                        data-bs-dismiss="modal"
                      >
                        Cancel
                      </button>
                      <button type="submit" className="btn btn-submit" disabled={loading}>
                        {loading ? "Saving..." : "Submit"}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="modal fade" id="edit-units">
        <div className="modal-dialog modal-dialog-centered custom-modal-two">
          <div className="modal-content">
            <div className="page-wrapper-new p-0">
              <div className="content">
                <div className="modal-header border-0 custom-modal-header">
                  <div className="page-title">
                    <h4>Edit Supplier</h4>
                  </div>
                  <button
                    type="button"
                    className="close"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                  >
                    <span aria-hidden="true">×</span>
                  </button>
                </div>
                <div className="modal-body custom-modal-body">
                  <form onSubmit={handleUpdate}>
                    <div className="row">
                      <div className="col-lg-4">
                        <div className="input-blocks">
                          <label>Supplier Name</label>
                          <input
                            type="text"
                            className="form-control"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                          />
                        </div>
                      </div>
                      <div className="col-lg-4">
                        <div className="input-blocks">
                          <label>Email</label>
                          <input
                            type="email"
                            className="form-control"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                          />
                        </div>
                      </div>
                      <div className="col-lg-4">
                        <div className="input-blocks">
                          <label>Phone</label>
                          <input
                            type="text"
                            className="form-control"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                          />
                        </div>
                      </div>
                      <div className="col-lg-12">
                        <div className="input-blocks">
                          <label>Address</label>
                          <input
                            type="text"
                            className="form-control"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="modal-footer-btn">
                      <button
                        type="button"
                        className="btn btn-cancel me-2"
                        data-bs-dismiss="modal"
                      >
                        Cancel
                      </button>
                      <button type="submit" className="btn btn-submit" disabled={loading}>
                        {loading ? "Saving..." : "Save Changes"}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupplierModal;
