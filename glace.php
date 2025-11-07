<?php 
$title = "Glace";
include_once 'header.php'; 
include_once 'function_glace.php'; 

$savSel = [];
$corSel = Null;
$supSel = [];
if (isset($_GET['saveur'])){$savSel = $_GET['saveur'];}
if (isset($_GET['cornet'])){$corSel = $_GET['cornet'];}
if (isset($_GET['supplement'])){$supSel = $_GET['supplement'];}
// Checkbox
$parfums = [
    "Fraise" => 4,
    "Spéculos" => 7,
    "Chocolat" => 5,
    "Vanille" => 3
];

// Radio
$cornets = [
    "Pot" => 2,
    "Cornet" => 3
];

// Checkbox
$supplements =[
    "Pépittes de chocolat" => 1,
    "Spéculos" => 2,
    "Chantilly " => 3
];

$prix = 0.00;
/**valeurGlace($savSel, $corSel, $supSel);*/

?>

<div class="container" style="margin-top:20px">
    <h2>Glacier</h2>
    <p>Mhhhh la glace</p>


    <form action="/glace.php" method="GET" class="form-group">
<!--
Nouvelle fonction possible :
formGenerator($type, $list, $name, $data)
formGenerator("checkbox", $parfums, $parfum, $_GET)
-->
        <div class="form-group mb-3">
            <?php foreach($parfums as $parfum => $prix): ?>
                <div class="checkbox">
                    <label for="parfum">
                        <?= checkbox('parfum', $parfum, $_GET) ?>
                        <?= $parfum ?> <?= $prix ?>€
                    </label>
                </div>
            <?php endforeach; ?>
        </div>

        <div class="form-group mb-3">
            <?php foreach($cornets as $cornet => $prix): ?>
                <div class="radio">
                    <label for="cornet">
                        <?= radio('cornet', $cornet, $_GET) ?>
                        <?= $cornet ?> <?= $prix ?>€
                    </label>
                </div>
            <?php endforeach; ?>
        </div>

        <div class="form-group mb-3">
            <?php foreach($supplements as $supplement => $prix): ?>
                <div class="checkbox">
                    <label for="supplement">
                        <?= checkbox('supplement', $supplement, $_GET) ?>
                        <?= $supplement ?> <?= $prix ?>€
                    </label>
                </div>
            <?php endforeach; ?>
        </div>
        
        <button type="submit">Composer ma glace</button>
        <input type="submit" value="Submit">
        <input type="reset" value="Reset">
    </form>
        
    <div class="prix container">
        <h2>Prix : <!--valeurGlace($savSel, $corSel, $supSel)-->€</h2>
    </div>
    <br>
    <h2>$_GET</h2>
    <pre><?php var_dump($_GET); ?></pre>
    <h2>$_POST</h2>
    <pre><?php var_dump($_POST); ?></pre>
</div>

<?php include_once 'footer.php'; ?>