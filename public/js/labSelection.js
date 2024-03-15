document.addEventListener ('DOMContentLoaded', () => {

    function handleLabClick(labId) {
        window.location.href = `/reservation/${labId}`;
    }

    document.getElementById('lab-a').addEventListener('click', function() {
        handleLabClick('a');
    });

    document.getElementById('lab-b').addEventListener('click', function() {
        handleLabClick('b');
    });

    document.getElementById('lab-c').addEventListener('click', function() {
        handleLabClick('c');
    });

});