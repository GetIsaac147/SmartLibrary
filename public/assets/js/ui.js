export function renderBooksTable(books, container, onDelete, onEdit) {
    container.innerHTML = "";
    
    books.forEach(book => {
        const tr = document.createElement("tr");
        const statusBadge = Number(book.available) > 0 
            ? '<span class="badge bg-success">Disponible</span>' 
            : '<span class="badge bg-danger">Agotado</span>';

        tr.innerHTML = `
            <td>
                <div class="fw-bold">${book.title}</div>
                <small class="text-muted">ISBN: ${book.isbn}</small>
            </td>
            <td>${book.author}</td>
            <td>${statusBadge}</td>
            <td>${book.available} / ${book.totalCopies}</td>
            <td>
                <div class="btn-group" role="group">
                    <button class="btn btn-sm btn-outline-primary edit-btn" title="Editar libro">
                        <i class="bi bi-pencil"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-danger delete-btn" title="Eliminar libro">
                        <i class="bi bi-trash"></i>
                    </button>
                </div>
            </td>
        `;

        tr.querySelector(".edit-btn").addEventListener("click", () => onEdit(book));

        tr.querySelector(".delete-btn").addEventListener("click", () => onDelete(book.id));
        
        container.appendChild(tr);
    });
}