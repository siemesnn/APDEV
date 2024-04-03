document.addEventListener ('DOMContentLoaded', () => {

    function handleLabClick(labId) {
        window.location.href = `/reservation/${labId}`;
    }

    document.getElementById('lab-a').addEventListener('click', function() {
        handleLabClick('A');
    });

    document.getElementById('lab-b').addEventListener('click', function() {
        handleLabClick('B');
    });

    document.getElementById('lab-c').addEventListener('click', function() {
        handleLabClick('C');
    });

});