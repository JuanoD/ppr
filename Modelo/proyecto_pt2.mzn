% Check https://www.hillelwayne.com/post/minizinc-2/ for optimizations
% minizinc .\proyecto_pt2.mzn .\data\Trivial2.dzn --solver org.gecode.gecode -s
enum ACTORES;
set of int: ESCENAS;
array[int] of int: Duracion;
int: n_escenas = length(Duracion);
ESCENAS = 1..n_escenas;
array[ACTORES, 1..n_escenas+1] of int: Escenas;
int: duracion_total = sum(i in Duracion)(i);
array[ACTORES] of set of int: escenas_actor = 
    [{j | j in ESCENAS where Escenas[i, j] == 1} | i in ACTORES];
array[ACTORES, 1..2] of int: Disponibilidad;
array[int, 1..2] of ACTORES: Evitar;

array[ESCENAS] of var 0..duracion_total: start_time;
array[ESCENAS] of var 0..duracion_total: end_time;
array[ACTORES] of var int: sueldo_actor;
array[ESCENAS] of var ESCENAS: orden_escenas;
var int: costo_total = sum(i in sueldo_actor)(i);
array[ACTORES] of var 0..duracion_total: actor_start_time;
array[ACTORES] of var 0..duracion_total: actor_end_time;
array[ACTORES] of var 0..duracion_total: tiempo_en_set;
var int: tiempo_compartido;

include "globals.mzn";
constraint alldifferent(orden_escenas) :: domain;
constraint sort(orden_escenas, [i | i in ESCENAS]);
% Esta restricción funciona como alldifferent pues 1..n_escenas es orden_escenas ordenado ascendentemente
% constraint sort(orden_escenas, [i | i in ESCENAS]) :: domain;

% Multi model: Relaciona tiempo de inicio y final con el orden de escenas.
% El arreglo que ordena los tiempos de inicio es el orden de las escenas.
constraint arg_sort(start_time, orden_escenas);
constraint lex_lesseq(orden_escenas, reverse(orden_escenas));

% La primera escena empieza en el tiempo cero y la última termina en el tiempo final.
constraint start_time[orden_escenas[1]] = 0;
constraint end_time[orden_escenas[n_escenas]] = duracion_total;

% nooverlap
constraint disjunctive_strict(start_time, Duracion);
% constraint forall(i, j in ESCENAS where i<j)(
%     start_time[i] + Duracion[i] <= start_time[j] \/
%     start_time[j] + Duracion[j] <= start_time[i]
% );
% constraint forall(i in 1..n_escenas-1)(
%     start_time[orden_escenas[i+1]] = end_time[orden_escenas[i]]
% );
% constraint forall(i in 1..n_escenas-1)(
%     start_time[orden_escenas[i+1]] = start_time[orden_escenas[i]] + Duracion[orden_escenas[i]]
% );

% Las escenas terminan después de que ha pasado un tiempo de que inician
% constraint forall(i in ESCENAS)(
%     end_time[i] = start_time[i] + Duracion[i]
% );
end_time = [start_time[i] + Duracion[i] | i in ESCENAS];

actor_end_time = [max([end_time[j] | j in escenas_actor[i]]) | i in ACTORES];
actor_start_time = [min([start_time[j] | j in escenas_actor[i]]) | i in ACTORES];
% El actor termina de trabajar en la escena en que trabaja con mayor tiempo final, y empieza en la que tiene el menor tiempo inicial. (Tiempo final máximo en que trabaja el actor - tiempo inicial mínimo en que trabaja) * costo por unidad de tiempo = sueldo
% constraint forall(i in ACTORES)(
%     tiempo_en_set[i] =
%         max([end_time[j] | j in escenas_actor[i]]) -
%         min([start_time[j] | j in escenas_actor[i]])
% );
tiempo_en_set = [actor_end_time[i] - actor_start_time[i] | i in ACTORES];
% constraint forall(i in ACTORES)(
%     sueldo_actor[i] = tiempo_en_set[i] * Escenas[i, n_escenas+1]
% );
sueldo_actor = [tiempo_en_set[i] * Escenas[i, n_escenas+1] | i in ACTORES];

constraint tiempo_compartido = 
    sum(i in index_set_1of2(Evitar))(
        % trace("T", 
        let {var int: t =
        min(actor_end_time[Evitar[i, 1]], actor_end_time[Evitar[i, 2]]) -
        max(actor_start_time[Evitar[i, 1]], actor_start_time[Evitar[i, 2]]);
        } in
        if t < 0 then 0 else t endif  
        % )
    );
constraint tiempo_compartido >= 0;

% Disponibilidad de tiempo
constraint forall(i in ACTORES)(
    (Disponibilidad[i, 2] != 0) -> (tiempo_en_set[i] <= Disponibilidad[i, 2])
    % Asumo que la disponibilidad está en el mismo orden que los actores, pues ya he declarado que disponibilidad solo contiene enteros y minizinc no me permite recorrer tiempo_en_set con enteros, deben ser actores.
    % (Disponibilidad[i, 2] != 0) -> (tiempo_en_set[Disponibilidad[i, 1]] <= Disponibilidad[i, 2])
);

solve % :: int_search(start_time, dom_w_deg, indomain_min)
    minimize 2*costo_total + tiempo_compartido;
output ["orden_escenas = \(orden_escenas);\n"]
    ++ ["start_time = \(start_time);\n"]
    ++ ["end_time = \(end_time);\n"]
    ++ ["ACTORES = \(ACTORES);\n"]
    ++ ["actor_start_time = \(actor_start_time);\n"]
    ++ ["actor_end_time = \(actor_end_time);\n"]
    ++ ["tiempo_en_set = \(tiempo_en_set);\n"]
    ++ ["sueldo_actor = \(sueldo_actor);\n"]
    ++ ["costo_total = \(costo_total);\n"]
    ++ ["tiempo_compartido = \(tiempo_compartido);"]
    % ++ ["\(arg_sort(orden_escenas))"]
    ;
