export function showLoading(text = 'Cargando...') {
    if (typeof Swal !== 'undefined') {
        const gifUrl = new URL('../assets/loading.gif', import.meta.url).href;
        Swal.fire({
            imageUrl: gifUrl,
            imageWidth: 100,
            imageHeight: 100,
            imageAlt: text,
            showConfirmButton: false,
            allowOutsideClick: false,
            background: 'transparent'
        });
    } else {
        console.warn('SweetAlert2 no está definido.');
    }
}

export function hideLoading() {
    if (typeof Swal !== 'undefined') {
        Swal.close();
    }
}
