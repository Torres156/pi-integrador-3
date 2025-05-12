<?php
namespace App\Helpers;

class FotoHelper
{
    protected $file = null;
    
    function __construct($file)
    {
        $this->file = $file;
    }

    function upload($path = "")
    {
        if (!$this->file)
            return;

        // checking file is valid.
    	if (!$this->file->isValid())
            return false;

        $fileName = rand(11111,9999999) . '.' . $this->file->getClientOriginalExtension();
        $destinationPath = public_path('uploads/img/'. $path);
        
        if (!file_exists($destinationPath)) {
            mkdir($destinationPath, 0755, true); // Cria a pasta, se não existir
        }
                
        // Salva o arquivo
        if (!$this->file->storeAs('uploads/img/' . $path, $fileName, 'public'))
            return false;

        // Retorna o nome do file
        return $fileName;
    }

     // Deleta um file do servidor, recebe um array do curso com o id_curso
     public static function delete($arquivo)
     {
         if(file_exists('./uploads/img/' . $arquivo)) 
             unlink('./uploads/img/' . $arquivo);
     }
}